const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Spoke = new Schema(
  {
    spokeName: {
      type: String,
      required: true,
    },
    spokeShortName: {
      type: String,
      required: true,
    },
    
    spokeUserName: {
      type: String,
      required: true,
    },
    
    spokePassword: {
      type: String,
      required: true,
    },
    
    
    isSpokeActive: {
      type: Boolean,
      required: true,
      default:true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Spokes", Spoke);