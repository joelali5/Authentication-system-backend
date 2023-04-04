const { Pool } = require("pg");
const dotenv = require("dotenv");

const ENV = process.env.NODE_ENV || "devvelopment";

dotenv.config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("No PGDATABASE or DATABASE_URL configured!");
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL
    }
    : {
        connectionString: process.env.PGDATABASE
    };

module.exports = new Pool(config);
