const express = require("express");
const fs = require('fs');
const JournalStory = require("../models/journalStory.model");
const { authenticateToken } = require("../utilities");
const upload = require("../multer");
const path = require("path");


const journalRouter = express.Router();


// CRUD operation
// note visited date is a journal date and visitedlocation is the location u are in
// imageUrl is an url to the picture of the story
journalRouter.post("/add-story", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // validate required fields
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));
  // validate visited date is not in the future
  if (parsedVisitedDate - new Date() > 0) {
    return res
      .status(400)
      .json({ message: "Please provide a valid visited date." });
  }

  try {
    const writeStory = new JournalStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    });
    await writeStory.save();
    res.status(200).json({
      story: writeStory,
      message: "Journal story successfully created.",
    });
  } catch (error) {
    res.status(400).json({
      error: error,
      message: "An unexpected error occurred while creating the journal story.",
    });
  }
});


// Get Story
journalRouter.get("/get-all-stories", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const getAllStories = await JournalStory.find({ userId: userId }).sort({
      isFavorite: -1,
    });
    res.status(200).json({
      stories: getAllStories,
      message: "Journal story successfully retrieved.",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Update Story
journalRouter.put("/edit-story/:id",  authenticateToken, async(req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // validate required fields
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));
  // validate visited date is not in the future
  if (parsedVisitedDate - new Date() > 0) {
    return res
      .status(400)
      .json({ message: "Please provide a valid visited date." });
  }
  
  try {
    // Find the travel story by ID and ensure it belongs to the authenticated user
    const journalStory = await JournalStory.findOne({ _id: id, userId: userId });
    if(!journalStory){
      return res.status(404).json({error: true, message: "not found"})
    }

    // Update
    const placeholderImgUrl = `http"//localhost:3000/api/v1/assets/img-1.jpg`;
    journalStory.title = title;
    journalStory.story = story;
    journalStory.visitedDate = visitedDate;
    journalStory.visitedLocation = visitedLocation;
    journalStory.imageUrl = imageUrl || placeholderImgUrl;

    await journalStory.save();
    res.status(200).json({ story: journalStory, message: "update successful" })
  } catch (error) {
    res.status(500).json({error: true, message: error.message})
  }
})

// Delete Story
journalRouter.delete("/delete-story/:id", authenticateToken, async(req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    // Find the travel story by ID and ensure it belongs to the authenticated user
    const journalStory = await JournalStory.findOne({ _id: id, userId: userId });
    if(!journalStory){
      return res.status(404).json({error: true, message: "not found"})
    }

    // Delete the travel story
    await journalStory.deleteOne({ _id: id, userId: userId });

    // Extract the filename from the imageUrl
    const imageUrl = journalStory.imageUrl;
    const filename = path.basename(imageUrl);

    // Define the file path
    const filePath = path.join(__dirname, "../uploads", filename)

    // Delete the image file from the uploads folder
    fs.unlink(filePath, (err) => {
      if(err){
        console.error("Failed to delete image file: ", err);
      }
    });
    res.status(200).json({ message: "Deleted" })
  } catch (error) {
    res.status(500).json({error: true, message: error.message})
  }
})

// Update isFav
journalRouter.put("/updateUrFav/:id", authenticateToken, async(req, res) => {
  const { id } = req.params;
  const { isFavorite } = req.body;
  const { userId } = req.user;

  try{
    const journalStory = await JournalStory.findOne({ _id: id, userId: userId })
    if(!journalStory){
      return res.status(404).json({error: true , message: "Not Found"})
    }

    journalStory.isFavorite = isFavorite;
    await journalStory.save()
    res.status(200).json({ story: journalStory, message: "Updated Favourite" })
  }catch(error){
    res.status(500).json({ error: true, message: error.message });
  }
})

// IMAGE CRUD
// route to handle image upload
journalRouter.post("/image-upload",upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please provide an image." });
      }
      const imageUrl = `http://localhost:3000/api/v1/story/uploads/${req.file.filename}`;
      res.status(201).json({ imageUrl });
    } catch (error) {
      res.status().json({ error: true, message: error.message });
    }
  }
);

// Delete an image from upload folder
journalRouter.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;
  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "ImageUrl parameter is required" });
  }

  try {
    // Extract the filname from the imageurl
    const filename = path.basename(imageUrl);

    // Define the file path
    const filePath = path.join(__dirname, "../uploads", filename);
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file from the uplaods folder
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image successfully deleted." });
    } else {
      res.status(200).json({ message: "Image does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Serve static files from the uploads and assets directory
journalRouter.use("/uploads",express.static(path.join(__dirname, "../uploads")));
journalRouter.use("/assets", express.static(path.join(__dirname, "../assets")));

module.exports = journalRouter;
