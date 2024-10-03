const mongoose = require("mongoose"); // Make sure to import mongoose
const boxSerialNo = require("../Models/BoxSerialNo");
const utils = require("../controllers/utils");
const shortid = require('shortid');

exports.generateBoxSerialNo = async (req, res) => {
    try {
        const { hubID, qnty } = req.body;

        // Validate input
        if (!hubID || !qnty || typeof qnty !== 'number' || qnty <= 0) {
            return utils.commonResponse(res, 400, "Invalid input parameters");
        }

        // Generate an array of unique short IDs for the box serial numbers
        const serialNos = new Array(qnty).fill(0).map(() => shortid.generate());

        // Generate a new boxID (ObjectId)
        const boxID = new mongoose.Types.ObjectId();

        // Find the last created box entry to get the last box number
        const lastBoxEntry = await boxSerialNo.findOne().sort({ createdAt: -1 }).exec();
        let initialBoxNumber = 1001; // Default starting number

        // If a last box entry is found, calculate the next initial box number
        if (lastBoxEntry) {
            initialBoxNumber = lastBoxEntry.initialBoxNumber + lastBoxEntry.serialNumber; // Start from the last entry
        }

        // Create a new entry in the database
        await boxSerialNo.create({
            boxID: boxID,
            serialNumber: qnty,
            serialNos: serialNos,
            initialBoxNumber: initialBoxNumber // Store only the initial box number
        });

        // Return success response with the starting box number
        utils.commonResponse(res, 200, "Box serial number generated", { hubID, boxID, serialNos, boxNumber: initialBoxNumber });

    } catch (error) {
        utils.commonResponse(res, 500, "Unexpected server error", error.toString());
    }
};
