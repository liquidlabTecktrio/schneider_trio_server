const mongoose = require("mongoose");

const ComponentSchema = new mongoose.Schema({
  serialNos: {
    type: [String],
    // requi?red: true,
  },
  componentName: {
    type: String,
    required: true,
  },
  componentSerialNo:{
    type: [String],
    required: true,
  },
  quantity: {
    type: Number,
    // required: true,
    min: 1,
  },
});

const BoxesSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
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

module.exports = mongoose.model("Boxes", BoxesSchema);