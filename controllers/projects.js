const mongoose = require("mongoose");
const Project = require("../Models/Projects");
const utils = require("../controllers/utils");

exports.getAllProjects = async (req, res) => {
  try {
    const projectIds = await Project.find(
      {},
      {
        ProjectID: 1,
        _id: 1,
        ProjectName: 1,
        status: 1,
        ProjectDate: 1,
        createdBy: 1,
      }
    );
    utils.commonResponse(
      res,
      200,
      "List of project IDs fetched successfully",
      projectIds
    );
  } catch (error) {
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};
exports.getProjectsDetails = async (req, res) => {
  try {
    const createdToId = new mongoose.Types.ObjectId("66d591c4915b1ce6ded55fac");
    const allprojects = await Project.aggregate([
      {
        $match: {
          createdTo: createdToId,
        },
      },
      {
        $project: {
          _id: 0,
          ProjectName: 1,
          ProjectID: 1,
          status: 1,
          switchBoardData: 1,
          boxSerialNumbers:1,
        },
      },
    ]);

    utils.commonResponse(
      res,
      200,
      "All projects fetched successfully",
      allprojects[0]
    );
  } catch (error) {
    utils.commonResponse(res, 500, "unexpected server error", error.toString());
  }
};
