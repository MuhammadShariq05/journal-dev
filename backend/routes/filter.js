const express = require('express');
const filterRoute = express.Router();
const { authenticateToken } = require("../utilities");
const JournalStory = require("../models/journalStory.model");

filterRoute.get("/", authenticateToken, async(req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  if (!startDate || !endDate) { return res.status(400).json({ message: "Please provide a start date and end date." }) }
  try {
    // Convert startDare and endDate to ISO 8601 format. This is required
    const filterStory = await JournalStory.find({ userId, visitedDate: { $gte: startDate, $lte: endDate } }).sort({ isFavorite: -1 })
    res.status(200).json({ stories: filterStory })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
})

module.exports = filterRoute;