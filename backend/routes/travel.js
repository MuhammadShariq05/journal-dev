const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const travelRouter = express.Router();

module.exports = travelRouter;

