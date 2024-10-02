const boxSerialNo = require("../Models/BoxSerialNo");
const utils = require("../controllers/utils");
const shortid = require('shortid');

exports.generateBoxSerialNo = async (req, res) => {
    try {
        const { hubID, boxID, qnty } = req.body;

        // Generate an array of unique short IDs for the box serial numbers
        const arr1 = new Array(qnty).fill(0).map(() => shortid.generate(6));

        // Update existing box serial numbers or create a new entry
        const boxSerial = await boxSerialNo.findOneAndUpdate(
            { boxID: boxID },
            {
                $inc: { serialNumber: qnty }, // Increment the serial number
                $push: { serialNos: { $each: arr1 } } // Add new serial numbers to the array
            },
            { new: true } // Return the updated document
        );

        // If no boxSerial found, create a new one
        if (!boxSerial) {
            await boxSerialNo.create({
                boxID: boxID,
                serialNumber: qnty,
                serialNos: arr1
            });
        }

        // Return success response
        utils.commonResponse(res, 200, "Box serial number generated", { hubID, boxID, serialNos: arr1 });

    } catch (error) {
        utils.commonResponse(res, 500, "Unexpected server error", error.toString());
    }
};
