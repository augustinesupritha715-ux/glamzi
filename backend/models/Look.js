const mongoose = require("mongoose")

const LookSchema = new mongoose.Schema({
  image: String,
  category: String,
  weather: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Look", LookSchema)