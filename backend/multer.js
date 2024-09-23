const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Destination folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if(file.mimetype.startwith("image/")){
    cb(null, true); // Accept the file without any error or problem (true = no errors) ### NOTE: The callback function is asynchronous and it will be executed after a certain amount of time which depends on your internet connection speed. So if you have an extremely fast internet connection then this delay might not seem to much but in case you don't have such a good internet connection, the delay can become very high or even infinite depending on how many files are being uploaded at once. 
  }else{
    cb(new Error("Only images are allowed"), false)
  }
}

// Initialize multer instance
const uplaod = multer({ storage, fileFilter })
module.exports = uplaod;
