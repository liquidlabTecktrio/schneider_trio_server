const Hubs = require("../Models/Hubs");
const utils = require("../controllers/utils");



exports.createHubs = async (req, res) => {
    try {
        const { hubName, hubShortName, userName, isHubActive } = req.body;
        await Hubs.create({ hubName, hubShortName, userName, isHubActive }).then(async (result) => {
            const allHubs = await Hubs.find();
            utils.commonResponse(res, 200, "hub created successfully",);

        }).catch((err) => {
            utils.commonResponse(res, 401, err.toString());

        });

    } catch (error) {
        utils.commonResponse(res, 500, "unexpected server error");
    }
}

exports.getAllHubs = async (res, res) => {
    try {
        const allHubs = Hubs.find();
        if (!allHubs) {
            utils.commonResponse(res, 200, "All hubs fetched successfully", allHubs);

        } else {
            utils.commonResponse(res, 200, "All hubs fetched successfully", []);

        }

    } catch (error) {
        utils.commonResponse(res, 500, "unexpected server error");

    }
}

