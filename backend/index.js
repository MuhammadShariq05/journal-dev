require('dotenv').config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const PORT = 3000;
const mainRoute = require('./routes/index');

mongoose.connect(config.connectionString);


const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/api/v1/', mainRoute);


app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
module.exports = app;
