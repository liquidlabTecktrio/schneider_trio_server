const mongoose = require("mongoose"); // Import mongoose
const Project = require("../Models/Projects"); // Import the correct model
const utils = require("../controllers/utils");

exports.getAllProjects = async (req, res) => {
  try {
    const projectIds = await Project.find(
      {},
      { ProjectID: 1, _id: 1, ProjectName: 1, status: 1, ProjectDate: 1 }
    );

    // Send a successful response using the utility function
    utils.commonResponse(
      res,
      200,
      "List of project IDs fetched successfully",
      projectIds // Extract just the ProjectID values
    );
  } catch (error) {
    // Handle errors and send a failure response using utility function
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};
exports.getProjectsDetails = async (req, res) => {
  try {
    const allprojects = await Project.aggregate([
      {
        $match: {
          createdTo: mongoose.Types.ObjectId("66d591c4915b1ce6ded55fac"),
        },
      },
      {
        $project: {
          _id: 0,
          ProjectName: 1,
          ProjectID: 1,
          status: 1,
        },
      },
    ]);

    utils.commonResponse(
      res,
      200,
      "All projects fetched successfully",
      allprojects
    );
  } catch (error) {
    utils.commonResponse(res, 500, "unexpected server error", error.toString());
  }
};
