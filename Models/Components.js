const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Components = new Schema(
  {
    componentName: {
      type: String,
      // required: true,
    },
    compShortName: {
      type: String,
      // required: true,
    },
    
    compPartNo: {
      type: String,
      // required: true,
    },
    compDescription: {
      type: String,
      // required: true
    },
    isCritical:{
      type:Boolean,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Component", Components);
