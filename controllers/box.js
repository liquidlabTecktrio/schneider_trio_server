const boxSerialNo = require("../Models/BoxSerialNo");
const utils = require("../controllers/utils");
const shortid = require('shortid');

exports.generateBoxSerialNo = async (req, res) => {
    try {
        const { hubID, boxID, qnty } = req.body;

        // Generate an array of unique short IDs for the box serial numbers
        const arr1 = new Array(qnty).fill(0).map(() => shortid.generate(6));

        // Find existing box serial entry
        const boxSerial = await boxSerialNo.findOne({ boxID: boxID });

        let boxNumbers = [];
        let startingBoxNumber;

        if (boxSerial) {
            // If boxSerial exists, retrieve current boxNumbers and serialNumber
            startingBoxNumber = boxSerial.serialNumber + 1000; // Starting from 1001
            boxNumbers = Array.from({ length: qnty }, (_, i) => startingBoxNumber + i);

            // Update existing entry
            await boxSerialNo.findOneAndUpdate(
                { boxID: boxID },
                {
                    $inc: { serialNumber: qnty }, // Increment the serial number
                    $push: { serialNos: { $each: arr1 }, boxNumbers: { $each: boxNumbers } } // Add new serial numbers and box numbers to the array
                }
            );
        } else {
            // If no boxSerial found, create a new one
            startingBoxNumber = 1001; // Start from 1001 for new entries
            boxNumbers = Array.from({ length: qnty }, (_, i) => startingBoxNumber + i);

            await boxSerialNo.create({
                boxID: boxID,
                serialNumber: qnty,
                serialNos: arr1,
                boxNumbers: boxNumbers
            });
        }

        // Return success response
        utils.commonResponse(res, 200, "Box serial number generated", { hubID, boxID, serialNos: arr1, boxNumbers });

    } catch (error) {
        utils.commonResponse(res, 500, "Unexpected server error", error.toString());
    }
};
