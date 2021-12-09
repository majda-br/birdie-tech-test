import * as express from "express";
import db from "../db";
import { asyncHandler } from "../utils";

export const events = express.Router();

events.get('/events', asyncHandler(async (_: express.Request, res: express.Response) => {
  let allEvents = await db.getEvents();
  res.status(200).json(allEvents);
}));

events.get("/events/types", asyncHandler(async (_: express.Request, res: express.Response) => {
  const types = await db.getEventTypes();
  res.status(200).json(types);
}));

events.get("/history/", asyncHandler(async (req: express.Request, res: express.Response) => {
  const {id } = req.query;
  let data = {};

  if (typeof id === "string" && id) {
    console.log("should fetch");
    data = await db.getCareRecipientHistory(id);
    console.log("finished fetching");
  }

  console.log("finishing response");

  res.status(200).json(data);
}));
