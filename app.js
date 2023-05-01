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
  updateEmail,
  updatePassword,
  updateName,
  uploadPhoto,
  updateBio,
  updatePhone,
  getImage,
  updatePhoto,
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

//Test
// app.get("/", (req, res) => {
//   res.send(`
//     <form action="/user/photo" method="POST" enctype="multipart/form-data">
//       <input type="file" name="image" />
//       <button type="submit">Upload</button>
//     </form>
//   `);
// });

app.post("/signup", signup);
app.post("/signin", signin);
app.get("/users", authenticateUser, getUsers);
app.get("/user", authenticateUser, userProfile);
app.patch("/user/email", authenticateUser, updateEmail);
app.patch("/user/password", authenticateUser, updatePassword);
app.post("/user/photo", uploadPhoto);
app.patch("/user/name", authenticateUser, updateName);
app.patch("/user/bio", authenticateUser, updateBio);
app.patch("/user/phone", authenticateUser, updatePhone);
app.get("/user/photo/", authenticateUser, getImage);
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
