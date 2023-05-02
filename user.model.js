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
  if (user.rowCount > 0) {
    passwordMatch = await utils.passwordMatch(password, user.rows[0].password);
  }

  return { user, passwordMatch };
};

//Get a User's Profile
exports.fetchProfile = async (user_id) => {
  const user = await db.query("SELECT * FROM users WHERE user_id = $1;", [
    user_id,
  ]);
  return user.rows[0];
};

//Update Profile
exports.changeProfile = async (user_id, email, name, phone, bio, hashedPassword) => {
  const result = await db.query(
    "UPDATE users SET email = $1, name=$2, phone=$3, bio=$4, password=$5 WHERE user_id = $6 RETURNING *;",
    [email, name, phone, bio, hashedPassword, user_id]
  );
  return result.rows[0];
};

//Add image to the database
exports.insertImage = async (name, data, user_id) => {
  const result = await db.query(
    "INSERT INTO images(name, data, user_id) VALUES($1, $2, $3);",
    [name, data, user_id]
  );
  return result.rows[0];
};

//Get a user's profile image
exports.fetchImage = async (user_id) => {
  const result = await db.query("SELECT * FROM images WHERE user_id = $1;", [
    user_id,
  ]);
  return result.rows[0];
};

//Update Image
exports.updateImg = async (name, data, user_id) => {
  const result = await db.query(
    "UPDATE images SET name=$1, data=$2 WHERE user_id=$3 RETURNING *;",
    [name, data, user_id]
  );
  return result.rows[0];
};