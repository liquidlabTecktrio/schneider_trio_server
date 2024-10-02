const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoxSerialNo = new Schema({
    boxID: {
        type: mongoose.Types.ObjectId,
        unique: true // Unique box ID
    },
    serialNumber: {
        type: Number,
        required: true,
        default: 1 // Default value
    },
    serialNos: { // Added this field
        type: [String], // Assuming serial numbers are strings
        default: [] // Default to an empty array
    },
    boxNumbers: {
        type: [Number], // Array to store unique box numbers
        default: [] // Default to an empty array
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model("BoxSerialNo", BoxSerialNo);
