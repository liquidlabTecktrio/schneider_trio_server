const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PartsSchema = new Schema({
  partNumber: {
    type: String,
  },

  partDescription: {
    type: String,
  },
  quantity: {
    type: Number,
  },

  isCritical: {
    type: Boolean,
  }
})

const componentSchema = new Schema({
  Enclosure: {
    type: String,
  },
  Reference: {
    type: String,
  },
  description: {
    type: String,
  },
  referenceNumber: {
    type: String,
  },
  compShortName: {
    type: String,
  },
  Quantity: {
    type: Number,
  },
  FixedQuantity: {
    type: Number,
    default: 0
  },
  isCritical: {
    type: Number,
  },
  parts: {
    type: [PartsSchema]
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
      required: true,
    },
    ProjectID: {
      type: String,
      // required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    createdTo: {
      type: mongoose.Types.ObjectId,
      required: true
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
