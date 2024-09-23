const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const addStorySchema = new Schema({
  title: {type: String, require: true},
  story: {type: String, require: true},
  visitedLocation: {type: [String], default: []},
  isFavorite: {type: Boolean, default: false},
  userId: {type: Schema.Types.ObjectId, ref: 'User', require: true},
  createdOn: {type: Date, default: Date.now},
  imageUrl: {type: String, required: true},
  visitedDate: {type: Date, required: true},
})

module.exports = mongoose.model('addStory', addStorySchema)
