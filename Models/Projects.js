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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", Projects);
