const express = require("express");
const cors = require("cors");
const userRoute = require("./user");
const travelRoute = require("./travel");

const router = express.Router();

router.use(cors({ origin: "*" }));
router.use(express.json());

// User routes
router.use("/user", userRoute);
// Add Travel story
router.use("/addTravelStory", travelRoute);

module.exports = router;
