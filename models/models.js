const db = require("./../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then((result) => result.rows);
};

exports.insertUser = (email, password) => {
  return db
    .query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;", [
      email,
      password,
    ])
    .then((result) => {
      return result.rows[0];
    });
};
