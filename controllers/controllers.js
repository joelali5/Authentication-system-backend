const { fetchUsers, insertUser } = require("./../models/models");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};

exports.postUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await insertUser(email, hashedPassword);
    res.status(201).send({ user: newUser });
  } catch (error) {
    next(error);
  }
};
