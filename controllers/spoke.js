const Spoke = require("../Models/Spoke");
const utils = require("../controllers/utils");
const { default: mongoose } = require("mongoose");


exports.createSpoke = async (req, res) => {
    // THIS FUNCTION WILL CREATE NEW SPOKE IN THE SYSTEM
    try {
        const { spokeName, spokeShortName , spokeUserName, spokePassword } = req.body;
        await Spoke.create({ spokeName, spokeShortName , spokeUserName, spokePassword}).then(async (result) => {
            const allSpokes = await Spoke.find();
            utils.commonResponse(res, 200, "spoke created successfully",allSpokes);
        }).catch((err) => {
            utils.commonResponse(res, 401,"unexpected server error", err.toString());
        });
    } catch (error) {
        utils.commonResponse(res, 500, "unexpected server error",error.toString());
    }
}

exports.deleteSpoke = async (req, res) => {
    // THIS FUNCTION WILL DELETE SPOKE FORM THE SYSTEM
    try {
        let { spokeID} = req.body;
        if(!spokeID){
            return utils.commonResponse(res, 400, "Missing spokeID");
        }
        spokeID = new mongoose.Types.ObjectId(spokeID)
        let result = await Spoke.deleteOne({ '_id':  spokeID});
        utils.commonResponse(res, 200, "spoke deleted successfully");
    } catch (error) {
        utils.commonResponse(res, 500, "unexpected server error",error.toString());
    }
}

exports.getAllSpokes = async (req, res) => {
    // THIS FUNCTION WILL RETURN ALL THE EXISTING SPOKES IN THE SYSTEM
    try {
        const allSpokes = await Spoke.find();
        utils.commonResponse(res, 200, "All hubs fetched successfully",allSpokes);
    } catch (error) {
        utils.commonResponse(res, 500, "unexpected server error",error.toString());

    }
}

