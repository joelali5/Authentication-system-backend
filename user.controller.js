const bcrypt = require("bcrypt");
const {
  createUser,
  fetchUsers,
  userLogin,
  fetchProfile,
  changeProfile,
  insertImage,
  fetchImage,
  updateImg,
} = require("./user.model");
const utils = require("./utils");
const jwt = require("jsonwebtoken");

//Create a new user
exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  //Check that user has filled the email and password
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Please fill in the missing fields..." });
  }
  //Check that the user has supplied a valid email
  if (!utils.isEmailValid(email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address..." });
  }
  try {
    //Create the new user
    await createUser(email, hashedPassword);
    res.status(200).send({message: "Registration Successful!"});
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
    if (user.rowCount === 0 || passwordMatch === false) {
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
    res.status(200).send({ profile: userProfile });
  } catch (error) {
    next(error);
  }
};

//Edit Profile
exports.updateProfile = async (req, res, next) => {
  const { userId } = req.user;
  const { email, name, phone, bio, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    //check that the email is valid
    if (!utils.isEmailValid(email)) {
      return res
        .status(400)
        .send({ message: "Please enter a valid email address..." });
    }
    await changeProfile(userId, email, name, phone, bio, hashedPassword);
    res.status(201).send({ message: "Profile updated successfully!" });
  } catch (error) {
    next(error);
  }
};

//UPLOAD IMAGE
exports.uploadPhoto = async (req, res, next) => {
  const { userId } = req.user;
  // const { name, data } = req.files.image;
  const data = req.files.data;
  const name = data.name;

  const imgData = data.toString("base64");

  try {
    //Send image off to the database
    await insertImage(name, imgData, userId);
    res.status(201).send({ message: "Image uploaded successfully" });
  } catch (error) {
    next(error);
  }
};

//GET IMAGE
exports.getImage = async (req, res, next) => {
  const {userId} = req.user;
  try {
    const img = await fetchImage(userId);
    res.status(200).send(img);
  } catch (error) {
    next(error);
  }
};

exports.updatePhoto = async (req, res, next) => {
  const { userId } = req.user;
  const { name, data } = req.files.image;
  const imgData = data.toString("base64");

  try {
    await updateImg(name, imgData, userId);
    res.status(201).send({ message: "Image successfully updated!" });
  } catch (error) {
    next(error);
  }
};
