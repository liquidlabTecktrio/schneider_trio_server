const mongoose = require("mongoose");

const ScannedSerialSchema = new mongoose.Schema({
    projectID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Project" 
    },
    serialNo: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ScannedSerial", ScannedSerialSchema);
