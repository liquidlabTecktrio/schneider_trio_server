const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoxSerialNo = new Schema(
  {
    hubID: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    serialNos: {
      type: [String], // Array of serial numbers (strings)
      required: true,
    },
  },
  {
    timestamps: true, // To track creation and update times
  }
);

module.exports = mongoose.model("BoxSerialNo", BoxSerialNo);
