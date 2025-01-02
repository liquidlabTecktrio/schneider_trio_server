const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HubUsers = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    hub_id:{
        type:String,
        required:true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HubUsers", HubUsers);