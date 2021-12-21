const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const viewSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  count: Number,
  uniques: Number,
  views: [{
    timestamp: Date,
    count: Number,
    uniques: Number
  }]
}, {timestamps: true});

module.exports = model("View", viewSchema);
