const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Printer = new Schema({
  printerIP: {
    type: String,
  },
  PrinterName:{
    type: String,
  }
});
module.exports = mongoose.model("Printer", Printer);
