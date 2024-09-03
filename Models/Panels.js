const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const Panel = new Schema(
  {
    panelName: {
      type: String,
      required: true,
    },
    panelShortName: {
      type: String,
      required: true,
    },
    panelPartNo: {
      type: String,
      required: true,
    },
    panelSize: {
      type: String,
      required: true,
    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Panels", Panel);
