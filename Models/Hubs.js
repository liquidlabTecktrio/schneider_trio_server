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
    hubUsername: {
      type: String,
      required: true,
    },
    hubPassword: {
      type: String,
      required: true,
    },
    
    isHubActive: {
      type: Boolean,
      required: true,
      default:true
    },
    logo_ZPL:{
      type:String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hubs", Hub);