const bcrypt = require("bcrypt");
const db = require("./db/connection");
const jwt = require("jsonwebtoken");

module.exports = {
  //Check if email exists
  checkEmailExists: async (email) => {
    const result = await db.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);
    if (result.rows[0] === undefined) {
      return false;
    } else {
      return true;
    }
  },

  //Check if the passwords match
  passwordMatch: async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  },

  isEmailValid: (email) => {
    return /\S+@\S+\.\S+/.test(email);
  },

  generateToken: (id) => {
    const token = jwt.sign({ userId: id }, process.env.SECRET, {
      expiresIn: "7d",
    });
    return token;
  },
};
