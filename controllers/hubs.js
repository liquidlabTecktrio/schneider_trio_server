const { default: mongoose } = require("mongoose");
const Hubs = require("../Models/Hubs");
const utils = require("../controllers/utils");

exports.createHubs = async (req, res) => {
    // THIS FUNCTION WILL CREATE NEW HUB
    try {
        const { hubName, hubShortName, hubUsername, hubPassword , logo_ZPL } = req.body;
        await Hubs.create({ hubName, hubShortName, hubUsername, hubPassword, logo_ZPL}).then(async (result) => {
            const allHubs = await Hubs.find();
            utils.commonResponse(res, 200, "hub created successfully", allHubs);
        }).catch((err) => {
            utils.commonResponse(res, 401, "unexpected server error", err.toString());
        });
    }
    catch (error) {
        utils.commonResponse(res, 500, "unexpected server error", error.toString());
    }
}

exports.deleteHub = async (req, res) => {
    // THIS FUNCTION WILL DELETE EXISTNG HUB
    try {
        let { hubID } = req.body;
        if (!hubID) {
            return utils.commonResponse(res, 400, "Missing hubID");
        }
        hubID = new mongoose.Types.ObjectId(hubID)
        let result = await Hubs.deleteOne({ _id: hubID });
        if (result.deletedCount > 0) {
            utils.commonResponse(res, 200, "Hub deleted successfully");
        } else {
            utils.commonResponse(res, 404, "Hub not found or already deleted");
        }
    } catch (err) {
        utils.commonResponse(res, 500, "Unexpected server error", err.toString());
    }

}

exports.getAllHubs = async (req, res) => {
    // THIS FUNCTION WILL RESPPOND WITH ALL THE AVAILABLE HUBS
    try {
        const allHubs = await Hubs.find();
        utils.commonResponse(res, 200, "All hubs fetched successfully", allHubs);

    } catch (error) {
        utils.commonResponse(res, 500, "unexpected server error", error.toString());

    }
}

exports.LoginToHubs = async (req, res) => {
    // THIS FUNCTION WILL HELP THE HUB TO GET THE AUTHENTICATION KEY FOR ENTERING THE PLATFORM
    try {
        const { hubUsername, hubPassword } = req.body;
        const hub = await Hubs.findOne({ hubUsername: hubUsername, hubPassword: hubPassword });
        if (hub) {
            utils.commonResponse(res, 200, "Login successfully", hub);
        } else {
            utils.commonResponse(res, 401, "Invalid username or password");
        }
    } catch (error) {
        utils.commonResponse(res, 500, "Unexpected server error", error.toString());
    }
};


