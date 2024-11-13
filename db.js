"use strict";
/** Database setup for jobly. */
const { Client } = require("pg"), { getDatabaseUri } = require("./config"), { PASSWORD } = require("./myPass");

const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: getDatabaseUri(),
  password: PASSWORD,
  port: 5432
}
)

db.connect();

module.exports = db;