const Spoke = require("../Models/Spoke");
const utils = require("../controllers/utils");



exports.createSpoke = async (req, res) => {
    try {
        const { spokeName, spokeShortName , spokeUserName, spokePassword } = req.body;
        // //console.log(spokeName, spokeShortName,"ee")
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
    try {
        let { spokeID} = req.body;
        if(!spokeID){

            return utils.commonResponse(res, 400, "Missing spokeID");
        }
        spokeID = new mongoose.Types.ObjectId(spokeID)
        let result = await Spoke.deleteOne({ '_id':  spokeID});
        // //console.log(spokeName, spokeShortName,"ee")
        // await Spoke.deleteOne({ spokeName, spokeShortName , spokeUserName, spokePassword}).then(async (result) => {
            // const allSpokes = await Spoke.find();
        utils.commonResponse(res, 200, "spoke deleted successfully");

        // }).catch((err) => {
        //     utils.commonResponse(res, 401,"unexpected server error", err.toString());

        // });

    } catch (error) {
        utils.commonResponse(res, 500, "unexpected server error",error.toString());
    }
}

exports.getAllSpokes = async (req, res) => {
    try {
        const allSpokes = await Spoke.find();
        utils.commonResponse(res, 200, "All hubs fetched successfully",allSpokes);

    } catch (error) {
        utils.commonResponse(res, 500, "unexpected server error",error.toString());

    }
}

