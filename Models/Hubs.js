const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Hub = new Schema(
  {
    hubName: {
      type: String,
      required: true,
    },
    hubShortName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    isHubActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hubs", Hub);