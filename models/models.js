const db = require("./../db/connection");

exports.fetchUsers = async () => {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
};

exports.insertUser = async (email, password) => {
  const result = await db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;",
    [email, password]
  );
  return result.rows[0];
};
