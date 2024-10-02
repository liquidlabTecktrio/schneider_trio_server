const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Projects = new Schema(
  {
    ProjectName: {
      type: String,
      // required: true,
    },
    ProjectID: {
      type: String,
      // required: true,
    },
    
    createdBy: {
      type: mongoose.Types.ObjectId,
      // required: true,
    },
    createdTo: {
      type: mongoose.Types.ObjectId,
      // required: true
    },
    status:
    {
        type: String
        
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Component", Components);
