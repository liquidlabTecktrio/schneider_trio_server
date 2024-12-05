const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const HubSerialNo = new Schema({
    hubID: {
        type: mongoose.Types.ObjectId
    },
    serialNo: {
        type: Number,
        default: 1
    },
    serialNos: {
        type: [String],

    }

})



const PanelSerialNo = new Schema(
    {
        hubSerialNo: {
            type: [HubSerialNo],
            required: true,
        },
        panelID: {
            type: mongoose.Types.ObjectId,
            required: true,
        },


    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("PanelSerialNo", PanelSerialNo);
