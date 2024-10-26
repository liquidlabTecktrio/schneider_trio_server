const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const componentSchema = new Schema({
  Enclosure: {
    type: String,
  },
  Reference: {
    type: String,
  },
  Description: {
    type: String,
  },
  Quantity: {
    type: Number,
  },
  FixedQuantity:{
    type:Number,
    default:0
  }
});

const switchBoardSchema = new Schema({
  switchBoard: {
    type: String,
  },
  components: {
    type: [componentSchema],
  },
});

const Projects = new Schema(
  {
    ProjectName: {
      type: String,
      // required: true,
    },
    ProjectID: {
      type: String,
      // required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      // required: true,
    },
    createdTo: {
      type: mongoose.Types.ObjectId,
      // required: true
    },
    status: {
      type: String,
    },
    switchBoardData: {
      type: [switchBoardSchema],
    },
    ProjectDate: {
      type: Date,
    },
    boxSerialNumbers: {  // New field to store box serial numbers
      type: [String],     // Array of strings
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", Projects);
