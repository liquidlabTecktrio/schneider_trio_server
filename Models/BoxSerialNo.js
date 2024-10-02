const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoxSerialNo = new Schema({
    boxID: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true // Optional: if you want each boxID to be unique
    },
    serialNumber: {
        type: Number,
        required: true,
        default: 1 // You can set a default value if needed
    }
}, {
    timestamps: true, // Optional: to add createdAt and updatedAt timestamps
});

module.exports = mongoose.model("BoxSerialNo", BoxSerialNo);
