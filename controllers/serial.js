const componentSerialNo = require("../Models/componentSerialNo")
const Components = require("../Models/Components")
const utils = require("../controllers/utils")
const shortid = require('shortid');
exports.generateComponentSerialNo = async (req, res) => {
    try {
        const { hubID, componentID, qnty } = req.body;

        const arr1 = new Array(qnty).fill(0).map((x) => shortid.generate(6));

        componentSerialNo.findOneAndUpdate({
            componentID: componentID,
            hubSerialNo: {
                $elemMatch: {
                    hubID: hubID
                }
            }
        }, {

            $inc: { "hubSerialNo.$.serialNo": qnty },
            $push: { "hubSerialNo.$.serialNos": { $each: arr1 } }
        },
            { returnNewDocument: true }

        ).then(async (compenetSerial) => {
            if (!compenetSerial) {
                await componentSerialNo.findOneAndUpdate({ componentID: componentID }, {
                    $push: { hubSerialNo: { hubID: hubID, serialNo: qnty, serialNos: arr1 } }
                }
                )
            }


            component = await Components.findById(componentID)
            utils.commonResponse(res, 200, "Component serial number generated", { hubID: hubID, componentID: componentID, compShortName:component.compShortName, serialNos: arr1 })


        })






    } catch (error) {
        utils.commonResponse(res, 500, "Unexpected server error", error.toString())
    }
}