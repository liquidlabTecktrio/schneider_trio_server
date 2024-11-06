const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partsSchema = new Schema({
  partName: {
    type: String,
  },
  parentNumber: {
    type: String,
  },
  partDescription: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  videoUrl: {
    type: String,
  },
});

const Components = new Schema(
  {
    referenceName: {
      type: String,
      // required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      // required: true,
    },
    parts: {
      type: [partsSchema],
    },

    isCritical: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CommercialReference", CommercialReference);
