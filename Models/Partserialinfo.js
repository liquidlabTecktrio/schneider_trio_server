const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let Partsserialinfo = new Schema({
  
  serial_no: {
    type: Number,
  },
  qty: {
    type: Boolean,
  },

});

module.exports = mongoose.model("Partsserialinfo", Partsserialinfo);
// TODO: NOTE
// 1. partName is part reference
// 2. crId is commercial refference id
