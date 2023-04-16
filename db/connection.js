const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/../.env.test` });

if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE or DATABASE_URL configured!");
}

const config = { connectionString: process.env.PGDATABASE };

module.exports = new Pool(config);
