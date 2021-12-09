import * as express from "express";
import db from "../db";
import { asyncHandler } from "../utils";

export const patients = express.Router();

patients.get('/patients', asyncHandler(async (_: express.Request, res: express.Response) => {
  let careRecipients = await db.getCareRecipients();
  res.status(200).json(careRecipients);
}));

patients.get("/patients/mood_history/", asyncHandler(async (req: express.Request, res: express.Response) => {
  const {id } = req.query;
  let data = {};

  if (typeof id === "string" && id) {
    console.log("should fetch");
    data = await db.getMoodHistory(id);
    console.log("finished fetching");
  }

  console.log("finishing response");

  res.status(200).json(data);
}));