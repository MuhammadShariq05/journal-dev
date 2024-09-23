const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const JournalStory = require("../models/journalStory.model");
const { authenticateToken } = require('../utilities');
const { parse } = require("dotenv");
const uplaod = require("../multer");

const journalRouter = express.Router();


// note visited date is a journal date and visitedlocation is the location u are in
// imageUrl is an url to the picture of the story
journalRouter.post('/add-story', authenticateToken, async(req, res) =>{
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // validate required fields
  if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
    return res.status(400).json({ message: 'Please provide all required fields.'});
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));
  // validate visited date is not in the future
  if((parsedVisitedDate - new Date()) > 0){
    return res.status(400).json({ message: 'Please provide a valid visited date.' })
  }
  
  try {
    const writeStory = new JournalStory(
      {
        title,
        story,
        visitedLocation,
        userId,
        imageUrl,
        visitedDate: parsedVisitedDate,
      }
    )
    await writeStory.save();
    res.status(200).json({ story: writeStory, message: 'Journal story successfully created.' })
  } catch (error) {
    res.status(400).json({
      error: error, message: "An unexpected error occurred while creating the journal story."
    })
  }
})

journalRouter.get('/get-all-stories', authenticateToken, async(req, res) => {
   const { userId } = req.user;

   try {
    const getAllStories = await JournalStory.find({ userId: userId }).sort({
      isFavorite: -1,
    });
    res.status(200).json({ stories: getAllStories, message: 'Journal story successfully retrieved.'});
   } catch (error) {
    res.status(500).json({ error: true, message: error.message });
   }
})

journalRouter.post('/image-upload', uplaod.single('image'), async(req, res) => {

})

module.exports = journalRouter;

