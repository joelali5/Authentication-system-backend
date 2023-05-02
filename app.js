const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cors = require("cors");

const {
  signup,
  getUsers,
  signin,
  authenticateUser,
  userProfile,
  uploadPhoto,
  getImage,
  updatePhoto,
  updateProfile,
} = require("./user.controller");
app.use(
  fileUpload({
    limits: {
      fileSize: 10000000, //10MB
    },
    abortOnLimit: true,
  })
);
app.use(cors());
app.use(express.json());

app.post("/signup", signup);
app.post("/signin", signin);
app.get("/users", authenticateUser, getUsers);
app.get("/user", authenticateUser, userProfile);
app.patch("/user/profile", authenticateUser, updateProfile);
app.post("/user/photo", authenticateUser, uploadPhoto);
app.get("/user/photo", authenticateUser, getImage);
app.patch("/user/photo/update", authenticateUser, updatePhoto);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Bad request!" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server error!");
});

module.exports = app;
