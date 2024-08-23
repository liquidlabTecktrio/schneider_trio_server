const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const componentObj = new Schema({
  componentId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
  },
  quantity: {
    type: Number,
    // required: true,
  },
});

const Panel = new Schema(
  {
    panelName: {
      type: String,
      required: true,
    },
    panelShortName: {
      type: String,
      required: true,
    },
    componentDetails: {
      type: [componentObj],
    },
    isPanelActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Panels", Panel);
