const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const starSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    timestamp: {
      type: String,
      default: new Date().toISOString(),
    },
    count: {
      type: Number,
      default: 0,
    },
    uniques: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = model("Star", starSchema);
