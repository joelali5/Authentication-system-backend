const db = require("./connection");

const createRelation = async () => {
  return db.query(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        photo VARCHAR DEFAULT 'change photo',
        name VARCHAR DEFAULT 'add a name',
        bio VARCHAR DEFAULT 'update status',
        phone VARCHAR DEFAULT 'add a phone number',
        UNIQUE (email)
    );`);
};

createRelation();
