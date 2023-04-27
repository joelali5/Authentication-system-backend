const bcrypt = require("bcrypt");
const db = require("./db/connection");
const jwt = require("jsonwebtoken");

module.exports = {
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
