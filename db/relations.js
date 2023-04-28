const db = require("./connection");

const createRelation = async () => {
  return db.query(`
    DROP TABLE IF EXISTS images;
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        name VARCHAR DEFAULT 'add a name',
        bio VARCHAR DEFAULT 'update status',
        phone VARCHAR DEFAULT 'add a phone number'
    );
    CREATE TABLE images(
      img_id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL,
      data VARCHAR NOT NULL,
      user_id INT,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );`);
};

createRelation();
