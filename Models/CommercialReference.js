const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partSchema = new Schema({
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

const CommercialReference = new Schema(
  {
    referenceName: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      // required: true,
    },
    parts: {
      type: [partSchema],
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
