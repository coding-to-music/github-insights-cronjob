const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const referrerSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  referrers: [{
    referrer: String,
    count: Number,
    uniques: Number,
  }]
}, {timestamps: true});

module.exports = model("Referrer", referrerSchema);
