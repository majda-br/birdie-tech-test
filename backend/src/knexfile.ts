import { Knex } from "knex";
import dbConfig from "./config";

const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    ...dbConfig.db
  },
};

export default config;