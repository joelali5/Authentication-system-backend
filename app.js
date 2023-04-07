const express = require("express");
const { getUsers, postUser } = require("./controllers/controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/errors");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.get("/api/users", getUsers);
app.post("/api/users", postUser);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;