const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HubUserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    PhoneNumber:{
      type:String, 
      required: true,
    }
  }
)

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
    HubUsers:[HubUserSchema],
    logo_ZPL:{
      type:String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hubs", Hub);