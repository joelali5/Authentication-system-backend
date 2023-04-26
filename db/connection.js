const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/../.env.test` });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("No PGDATABASE or DATABASE_URL configured!");
}

const config = { connectionString: process.env.DATABASE_URL, max: 2 };

module.exports = new Pool(config);
