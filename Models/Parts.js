const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parentIdsObj = new Schema({
  productId: {
    type: mongoose.Types.ObjectId, //currently not using
  },
  crId: {
    type: mongoose.Types.ObjectId, //currently not using
  },
  productNumber: {
    type: String,
  },
  crNumber: {
    type: String,
  },
});

const Parts = new Schema({
  partNumber: {
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
  isCritical: {
    type: Boolean,
    
  },
  parentIds: [parentIdsObj],
});

module.exports = mongoose.model("Parts", Parts);
// TODO: NOTE
// 1. partName is part reference
// 2. crId is commercial refference id
