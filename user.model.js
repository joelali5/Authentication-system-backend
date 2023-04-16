const passport = require("passport");
const db = require("./db/connection");
const utils = require("./utils");

exports.createUser = async (email, hashedPassword) => {
  const result = await db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;",
    [email, hashedPassword]
  );
  return result.rows[0];
};

exports.fetchUsers = async () => {
  const result = await db.query("SELECT * FROM users;");
  return result.rows;
};

exports.userLogin = async (email, password) => {
  const user = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
  if(utils.passwordMatch(password, user.rows[0].password)){
    return utils.generateToken(user.user_id);
  };
};
