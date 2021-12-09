import * as express from "express";

interface ExpressHandler {
  (req: express.Request, res: express.Response, next?: express.NextFunction): void;
};

interface AsyncHandler {
  (handler: ExpressHandler): ExpressHandler;
};


export const asyncHandler: AsyncHandler = (handler: ExpressHandler) => {
  return async (req: express.Request, res: express.Response, next?: express.NextFunction) => {
    try {
      handler(req, res, next);
      return;
    } catch (err) {
      console.error("\x1b[31m(!) Error during processing of " + req.method + ' ' + req.path + "\x1b[0m");
      console.error(err);
      res.status(500).end("Internal Server error");
    }
  };
};


export const promiseAllKeys = async (object: {[index: string]: Promise<any>}) => {
	let keys: string[] = [];
	let promises = [];

	for(const key in object) {
		keys.push(key);
		promises.push(object[key]);
	}

	let values = await Promise.all(promises);
	let res: {[index: string]: any} = {};

	for(let i = 0; i < keys.length; i++) {
		res[keys[i]] = values[i];
	}

	return res;
};