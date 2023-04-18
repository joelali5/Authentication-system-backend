const db = require("./db/connection");
const utils = require("./utils");

//Add a new user to the DB
exports.createUser = async (email, hashedPassword) => {
  const result = await db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;",
    [email, hashedPassword]
  );
  return result.rows[0];
};

//Fetch all users from the DB
exports.fetchUsers = async () => {
  const result = await db.query("SELECT * FROM users;");
  return result.rows;
};

//Log users in
exports.userLogin = async (email, password) => {
  const user = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
  let passwordMatch;
  if(user.rowCount > 0){
    passwordMatch = await utils.passwordMatch(password, user.rows[0].password);
  }
  
  return {user, passwordMatch};
};