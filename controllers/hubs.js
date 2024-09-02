const Hubs = require("../Models/Hubs");
const utils = require("../controllers/utils");



exports.createHubs = async (req, res) => {
    try {
        const { hubName, hubShortName } = req.body;
        await Hubs.create({ hubName, hubShortName }).then(async (result) => {
            const allHubs = await Hubs.find();
            utils.commonResponse(res, 200, "hub created successfully",allHubs);

        }).catch((err) => {
            utils.commonResponse(res, 401,"unexpected server error", err.toString());

        });

    } catch (error) {
        utils.commonResponse(res, 500, "unexpected server error",error.toString());
    }
}

exports.getAllHubs = async (req, res) => {
    try {
        const allHubs = await Hubs.find();
        utils.commonResponse(res, 200, "All hubs fetched successfully",allHubs);

    } catch (error) {
        utils.commonResponse(res, 500, "unexpected server error",error.toString());

    }
}

