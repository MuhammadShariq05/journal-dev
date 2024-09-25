const express = require("express");
const cors = require("cors");
const userRoute = require("./user");
const journalRoute = require("./journal");
const seacrhRoute =  require("./search");
const filterRoute = require("./filter");
const router = express.Router();

router.use(cors({ origin: "*" }));
router.use(express.json());

// User routes
router.use("/user", userRoute);
// Add Travel story
router.use("/story", journalRoute);
// Seacrh
router.use("/search", seacrhRoute);
// Filter by date,
router.use("/filter", filterRoute)

module.exports = router;
