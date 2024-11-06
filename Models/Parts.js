const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parentIdsObj = new Schema({
  productId: {
    type: mongoose.Types.ObjectId,
  },
  crId: {
    type: mongoose.Types.ObjectId,
  },
});

const Parts = new Schema({
  partName: {
    type: String,
  },
  partDescription: {
    type: String,
  },
  quantitty: {
    type: Number,
  },
  videoUrl: {
    type: String,
  },
  isCritical: {
    type: Boolean,
  },
  parentIds: [parentIdsObj],
});

module.exports = mongoose.model("Parts", Parts);
// TODO: NOTE
// 1. partName is part reference
// 2. crId is commercial refference id
