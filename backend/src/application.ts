import * as express from "express";
import * as path from 'path';

import { events } from "./controllers/events";
import { patients } from "./controllers/patient";

const app = express();
app.use(express.json());

app.use("/api", events);
app.use("/api", patients);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
};

app.use((_, res) => {
  res.sendStatus(404);
});

export default app;
