const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HubSerialNo = new Schema({
  hubId: {
    type: mongoose.Types.ObjectId,
  },
  serialNo: {
    type: Number,
    default: 1,
  },
  serialNos: {
    type: [String],
  },
});

const PartsSerialNo = new Schema(
  {
    hubSerialNo: {
      type: [HubSerialNo],
      required: true,
    },
    partId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    partNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PartsSerialNo", PartsSerialNo);
