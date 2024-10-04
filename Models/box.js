const mongoose = require("mongoose");

const ComponentSchema = new mongoose.Schema({
  serialNos: {
    type: [String],
    required: true,
  },
  componentName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const boxesSchema = new mongoose.Schema({
  projectID: {
    type: String,
    // required: true,
    unique: true,
  },
  serialNo: {
    type: String,
    required: true,
    unique: true,
  },
  components: [ComponentSchema], // Placed outside of serialNo
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("boxes", boxesSchema);
