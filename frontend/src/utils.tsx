import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, Method } from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


// boolean to check the environnement mode: DEV or PROD ?
export const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// Override the default console.log function
export const log = (...data: any[]) => {
	if(development) {
		console.log('[BIRDIE-TEST]', ...data);
	};
};

interface Options {
  [index: string]: any
}

// Helper function for GET requests
// This is useful and get rid of the try-catch blocks !!!
export const niceFetch = async (url: string, options?: Options) => {
	const timeout = (options && options.timeout) || 5000;

	try {
		const res = await axios.get(url, { timeout, ...options });
		if(res.statusText !== "OK") {
			throw new Error(res.status + ' Error: ' + res.statusText);
		}
		return res.data;
	} catch(err) {
		console.error(err);
		throw new Error('Could not GET from: ' + url);
	}
};

// Helper function for POST, PATCH, DELETE.... requests
export const niceSend = async (url: string, method: Method, data: any) => {
	const withData = data !== undefined;
	const timeout = 5000;
	const headers = withData ? { 'Content-Type': 'application/json' } : undefined;
  const config: AxiosRequestConfig =  {url, method, headers, data, timeout };
	
	try {
		const res = await axios(config);
		if(res.statusText !== "OK") {
			throw new Error(res.status + ' Error: ' + res.statusText);
		}
		return res.data;
	} catch (err) {
		console.error(err);
		throw new Error('Could not ' + method + ' to ' + url);
	}
};

export const usePrefetch = (url: string): [data: any, updateData: () => Promise<any>] => {
  const [data, setData] = useState([]);

  log("prefetch", url)

  const updateData = async () => {
    const newData = await niceFetch(url);
    setData(newData);
    return newData;
  };

  useEffect(() => {
    updateData();
  }, []);

  return [data, updateData];
};

export const useDynamicPrefetch = (url: string, dependencies: any[]): [data: any, updateData: () => Promise<any>] => {
  log("prefetch", url)
  const [data, setData] = useState([]);

  const updateData = async () => {
    const newData = await niceFetch(url);
    setData(newData);
    return newData;
  };

  useEffect(() => {
    updateData();
  }, [...dependencies]);

  return [data, updateData];
};