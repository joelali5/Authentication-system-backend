const db = require("./../connection");
const format = require("pg-format");

const seed = async (userData) => {
  //Drop the users table
  await db.query(`DROP TABLE IF EXISTS users;`);

  //Create the users table
  await db.query(`
        CREATE TABLE users(
            email VARCHAR PRIMARY KEY,
            password VARCHAR NOT NULL,
            photo VARCHAR,
            name VARCHAR,
            bio VARCHAR,
            phone VARCHAR,
            UNIQUE (email)
        )
    ;`);

  //Create the sql query string
  const insertUserQueryStr = format(
    "INSERT INTO users (email, password, photo, name, bio, phone) VALUES %L RETURNING *;",
    userData.map(({ email, password, photo, name, bio, phone }) => [
      email,
      password,
      photo,
      name,
      bio,
      phone,
    ])
  );
  db.query(insertUserQueryStr).then((result) => result.rows);
};

module.exports = seed;
