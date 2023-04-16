// const {utils} = require("./utils");
const bcrypt = require("bcrypt");
const { createUser, fetchUsers, userLogin } = require("./user.model");
const utils = require("./utils");

//Create a new user
exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please fill in the missing fields..." });
    }
    if (!utils.isEmailValid(email)) {
      return res
        .status(400)
        .send({ message: "Please enter a valid email address..." });
    }
    const newUser = await createUser(email, hashedPassword);
    return res.status(201).send({ newUser });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    return res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  const token = await userLogin(email, password);
  return res.status(200).send(token);
};
