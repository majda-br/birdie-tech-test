import { Knex, knex } from "knex";
import config from "./knexfile";
import { promiseAllKeys } from "./utils";


interface Database {
  knex: Knex,
  init(this: Database): void,
  selectDistinct(this: Database, field: string): any,
  getEvents(this: Database): any,
  getEventTypes(this: Database): any,
  getCareRecipients(this: Database): any,
  getCareRecipientHistory(this: Database, id: string): any,
  getMoodHistory(this: Database, id: string): any;
}

const db: Database = {
  knex: knex(config),

  async init(this: Database) {
    // connection to database
    this.knex = knex(config);
    console.log("Connection to database established successfully");
  },

  async selectDistinct(this: Database, field: string) {
    return this.knex("events")
      .distinct(field)
      .then(rows => rows.map(row => row[field]));
  },

  async getEvents(this: Database) {
    return this.knex("events")
      .then(rows => rows.map(row => row.payload));
  },

  async getEventTypes(this: Database) {
    return this.selectDistinct("event_type");
  },

  async getCareRecipients(this: Database) {
    return this.selectDistinct("care_recipient_id");
  },

  async getCareRecipientHistory(this: Database, id: string) {
    const data: string[] = await this.knex("events")
      .distinct("visit_id")
      .where("care_recipient_id", id)
      .orderBy("timestamp", "desc")
      .then(rows => rows.map(row => row["visit_id"]));

    const res: {[index: string]: Promise<any>} = {};
    data.forEach(visit_id => {
      res[visit_id] = this.knex("events")
      .select("id", "event_type", "timestamp", "caregiver_id", "payload", "payload_as_text")
      .where("visit_id", visit_id)
      .orderBy("timestamp", "asc")
    });

    // data structure that we get is an Object with:
    // - visits ids as a key and
    // - an array of the visit's corresponding events as a value

    return promiseAllKeys(res);
  },

  async getMoodHistory(this: Database, id: string) {
    const data: string[][] = await this.knex("events")
      .select("payload")
      .where("care_recipient_id", id)
      .where("event_type", "mood_observation")
      .orderBy("timestamp", "asc")
      .then(mood_observations => 
        mood_observations.map(mood_observation => 
          [mood_observation["payload"].mood, mood_observation["payload"].timestamp]));

      const res: string[][] = [data.map(el => el[0]), data.map(el => el[1])];
      
      // data structure that we get is an array containing 2 arrays :
      // - one containing the values of the mood of the patient (sorted by timestamp asc),
      // - another containing the relative timestanmps.
      
      return res;
  },

};

export default db;