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
        let startingBoxNumber = 1001; // Default starting number

        if (lastBoxEntry && lastBoxEntry.boxNumbers.length > 0) {
            // Get the last box number from the last entry
            startingBoxNumber = Math.max(...lastBoxEntry.boxNumbers) + 1; // Increment from the last number
        }

        // Generate unique box numbers incrementally
        const boxNumbers = Array.from({ length: qnty }, (_, i) => startingBoxNumber + i);

        // Create a new entry in the database
        await boxSerialNo.create({
            boxID: boxID,
            serialNumber: qnty,
            serialNos: serialNos,
            boxNumbers: boxNumbers
        });

        // Return success response
        utils.commonResponse(res, 200, "Box serial number generated", { hubID, boxID, serialNos, boxNumbers });

    } catch (error) {
        utils.commonResponse(res, 500, "Unexpected server error", error.toString());
    }
};
