// boxSerialNo.js (your model)
const mongoose = require("mongoose");

const boxSerialNoSchema = new mongoose.Schema({
    boxID: { type: mongoose.Types.ObjectId, required: true },
    serialNumber: { type: Number, required: true },
    serialNos: { type: [String], required: true },
    initialBoxNumber: { type: Number, required: true }, // Store only the initial box number
}, { timestamps: true });

const boxSerialNo = mongoose.model("BoxSerialNo", boxSerialNoSchema);
module.exports = boxSerialNo;
