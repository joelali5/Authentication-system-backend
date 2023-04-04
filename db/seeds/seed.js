const db = require("./../connection");
const format = require("pg-format");

const seed = async ({ userData }) => {
  //Drop the users table
  await db.query(`DROP TABLE IF EXISTS users;`);

  //Create the users table
  await db.query(`
        CREATE TABLE users(
            email VARCHAR(200) PRIMARY KEY NOT NULL,
            password VARCHAR(200) NOT NULL
            photo VARCHAR(200),
            name VARCHAR(200),
            bio VARCHAR(200),
            phone VARCHAR(200),
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
