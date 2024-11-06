const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Products = new Schema({
  productName: {
    type: String,
  },
  productDescription: {
    type: String,
  },
  parentId: {
    type: mongoose.Types.ObjectId,
  },
  quantity: {
    type: Number,
  },
});

module.exports = mongoose.model("Products", Products);
