const mongoose = require("mongoose");

//  Your code goes here
const marioSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    min: 1,
    required: true,
  },
});

const Mario = mongoose.model("Mario", marioSchema);

module.exports = Mario;
