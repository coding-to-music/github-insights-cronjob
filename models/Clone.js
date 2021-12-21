const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cloneSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  count: Number,
  uniques: Number,
  clones: [{
    timestamp: Date,
    count: Number,
    uniques: Number
  }]
}, {timestamps: true});

module.exports = model("Clone", cloneSchema);
