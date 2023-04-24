const bcrypt = require("bcrypt");
const { createUser, fetchUsers, userLogin, fetchProfile, updateEmail } = require("./user.model");
const utils = require("./utils");
const jwt = require("jsonwebtoken");

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
    const user = { email: newUser.email };
    return res.status(201).send({ user });
  } catch (error) {
    next(error);
  }
};

//Get all the registered users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    users.forEach((user) => delete user["password"]);
    return res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};

//Sign in an existing user
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  //Check the req has the email & password
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Please fill in the missing fields..." });
  }
  //Check that email address is authentic
  if (!utils.isEmailValid(email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address..." });
  }
  try {
    const { user, passwordMatch } = await userLogin(email, password);
    let token;

    //Check that there is a user with the provided email
    if (user.rowCount === 0 || passwordMatch === undefined) {
      res
        .status(404)
        .send({ message: "Incorrect email or password! Try again..." });
    } else {
      //Generate the jwt token
      token = utils.generateToken(user.rows[0].user_id);
      //Send the token to the user
      res.status(200).send({ token });
    }
  } catch (error) {
    next(error);
  }
};

//Authenticate user before granting them access to certain routes
exports.authenticateUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Signin to gain access..." });
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .send({ message: "Forbidden! Invalid access token" });
    req.user = user;
    next();
  });
};

//Get Profile
exports.userProfile = async (req, res, next) => {
  const userId = req.user.userId;
  try {
    const userProfile = await fetchProfile(userId);
    res.status(200).send({profile: userProfile});
  } catch (error) {
    next(error);
  }
};

//Edit Profile
exports.updateEmail = async (req, res, next) => {
  const {userId} = req.user;
  const {newEmail} = req.body
  try {
    //check that the email is valid
    if (!utils.isEmailValid(newEmail)) {
      return res
        .status(400)
        .send({ message: "Please enter a valid email address..." });
    }
    const updatedEmail = await updateEmail(userId, newEmail);
    res.status(201).send({user: updatedEmail});
  } catch (error) {
    next(error);
  }
};


exports.updatePassword = async (req, res, next) => {
  
};

exports.updatePhoto = async (req, res, next) => {};

exports.updateName = async (req, res, next) => {};

exports.updateBio = async (req, res, next) => {};

exports.updatePhone = async (req, res, next) => {};
