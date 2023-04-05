const express = require('express');
const cors = require('cors');
const app = express();

const {getUsers} = require('./controllers/controllers');

app.use(express.json());
app.use(cors());

app.get('/api/users', getUsers);

module.exports = app;