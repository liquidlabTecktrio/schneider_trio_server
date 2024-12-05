const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const BOM = new Schema ({
    componentID:{
        type: mongoose.Types.ObjectId
    },
    qnty:{
        type: Number,
        default:1
    },
  

})


const PanelType = new Schema(
  {
    PanelType: {
      type: String,
      required: true,
    },
    BOMList: {
      type: [BOM],
    
    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PanelType", PanelType);
