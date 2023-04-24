const express = require("express");
const app = express();
const {
  signup,
  getUsers,
  signin,
  authenticateUser,
  userProfile,
  updateEmail,
  updatePassword,
  updateName,
  updatePhoto,
  updateBio,
  updatePhone
} = require("./user.controller");
app.use(express.json());

app.post("/signup", signup);
app.post("/signin", signin);
app.get("/users", authenticateUser, getUsers);
app.get("/user", authenticateUser, userProfile);
app.patch("/user/email", authenticateUser, updateEmail);
app.patch("/user/password", authenticateUser, updatePassword);
// app.patch("/user/photo", authenticateUser, updatePhoto);
app.patch("/user/name", authenticateUser, updateName);
app.patch("/user/bio", authenticateUser, updateBio);
app.patch("/user/phone", authenticateUser, updatePhone);

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
