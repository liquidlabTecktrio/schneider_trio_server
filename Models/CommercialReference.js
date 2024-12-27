const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partSchema = new Schema({
  partNumber: {
    type: String,
  },
  partDescription: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  grouped: {
    type: Boolean,
  },
  PiecePerPacket: {
    type: Number
  },
  videoUrl: {
    type: String,
  },
  isCritical: {
    type: Boolean,
  },
  parentNumber: {
    type: String,
  },
});

const CommercialReference = new Schema(
  {
    referenceNumber: {
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
    quantity: {
      type: Number,
    },
    productNumber: {
      type: String,
    },
    isCritical: {
      type: Boolean,
    },
    isActive:{
      type:Boolean,
      default:true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CommercialReference", CommercialReference);
