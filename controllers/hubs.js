const { default: mongoose } = require("mongoose");
const Hubs = require("../Models/Hubs");
const utils = require("../controllers/utils");



exports.createHubs = async (req, res) => {
    try {
        const { hubName, hubShortName , hubUsername, hubPassword} = req.body;
       
        await Hubs.create({ hubName, hubShortName, hubUsername, hubPassword }).then(async (result) => {
            const allHubs = await Hubs.find();
            utils.commonResponse(res, 200, "hub created successfully",allHubs);

        }).catch((err) => {
            utils.commonResponse(res, 401,"unexpected server error", err.toString());

        });

    } 
    catch (error) {
        utils.commonResponse(res, 500, "unexpected server error",error.toString());
    }
}

exports.deleteHub = async (req, res) => {
    try {
        // Attempt to delete the hub

        const { hubID} = req.body;
        hubID = new mongoose.Types.ObjectId(hubID)
        const result = await Hubs.deleteOne({ '_id':  hubID});
        
        if (result.deletedCount > 0) {
            // Fetch all remaining hubs after deletion
            // const allHubs = await Hubs.find();
            utils.commonResponse(res, 200, "Hub deleted successfully");
        } else {
            utils.commonResponse(res, 404, "Hub not found or already deleted");
        }
    } catch (err) {
        // Handle unexpected errors
        utils.commonResponse(res, 500, "Unexpected server error", err.toString());
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

exports.LoginToHubs = async (req, res) => {
    try {
        const { hubUsername, hubPassword } = req.body;
        //console.log(hubUsername);

        // Find the hub by username and password
        const hub = await Hubs.findOne({ hubUsername: hubUsername, hubPassword: hubPassword });

        if (hub) {
            // If the hub is found, send a success response
            utils.commonResponse(res, 200, "Login successfully", hub);
        } else {
            // If the hub is not found (invalid username/password), send an error response
            utils.commonResponse(res, 401, "Invalid username or password");
        }
    } catch (error) {
        // Handle unexpected errors
        utils.commonResponse(res, 500, "Unexpected server error", error.toString());
    }
};


