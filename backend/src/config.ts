import * as YAML from "yaml";
import * as fs from "fs";

const dbConfig = YAML.parse(fs.readFileSync('./config.yaml', { encoding: 'utf8' }));

export default dbConfig;