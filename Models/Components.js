const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Components = new Schema(
  {
    componentName: {
      type: String,
      required: true,
    },
    compShortName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Component", Components);
