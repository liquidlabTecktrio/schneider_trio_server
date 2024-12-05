const mongoose = require("mongoose");

const ComponentSchema = new mongoose.Schema({
  componentName: {
    type: String,
  },
  componentSerialNo: {
    type: [String],
    required: true,
  },
  componentID: {
    type: mongoose.Types.ObjectId,
  },
  quantity: {
    type: Number,
    // required: true,
    default: 0,
  },
});

const BoxesSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Types.ObjectId,
      // required: true,
    },
    status: {
      type: String,
      default: "open",
    },
    serialNo: {
      type: String,
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      // required: true,
      default: 0,
    },
    components: [ComponentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Boxes", BoxesSchema);
