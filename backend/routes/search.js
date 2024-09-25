const express = require('express');
const searchRoute = express.Router();
const { authenticateToken } = require("../utilities");
const JournalStory = require("../models/journalStory.model");

searchRoute.get('/', authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if(!query){
    return res.status(404).json({ error: true, message: 'No query provided' })
  }

  try {
    const searchResults = await JournalStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } }
      ]
    }).sort({ isFavourite: -1 })

    res.status(200).json({ stories: searchResults });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }

})


module.exports = searchRoute;
