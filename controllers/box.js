const mongoose = require("mongoose");
const boxSerialNo = require("../Models/BoxSerialNo");
const utils = require("../controllers/utils");
const shortid = require('shortid');

exports.generateBoxSerialNo = async (req, res) => {
    try {
        const { hubID, qnty } = req.body;

        if (!hubID || !qnty || typeof qnty !== 'number' || qnty <= 0) {
            return utils.commonResponse(res, 400, "Invalid input parameters");
        }

        const existingBoxSerial = await boxSerialNo.findOne({ hubID });
        let serialCounter = existingBoxSerial ? existingBoxSerial.serialNos.length + 1 : 1;

        const boxSerialNos = Array.from({ length: qnty }, () => {
            const serialNo = shortid.generate();
            const sixDigitNo = serialCounter.toString().padStart(6, '0');
            serialCounter += 1;
            return `${serialNo}${sixDigitNo}`;
        });

        if (existingBoxSerial) {
            await boxSerialNo.updateOne(
                { hubID },
                { 
                    $push: { serialNos: { $each: boxSerialNos } }, 
                    $inc: { serialNoCount: qnty } 
                }
            );
        } else {
            await boxSerialNo.create({ hubID, serialNos: boxSerialNos, serialNoCount: qnty });
        }

        utils.commonResponse(res, 200, "Box serial numbers generated", { hubID, boxSerialNos });
    } catch (error) {
        utils.commonResponse(res, 500, "Unexpected server error", error.toString());
    }
};
