const mongoose = require("mongoose");
const Project = require("../Models/Projects");
const utils = require("../controllers/utils");

exports.getAllProjects = async (req, res) => {
  try {
    
    const { _id } = req.body;

    
    const query = _id ? { _id } : {};

    
    const projectIds = await Project.find(query, {
      ProjectID: 1,
      _id: 1,
      ProjectName: 1,
      status: 1,
      ProjectDate: 1,
      createdBy: 1,
    });

    
    utils.commonResponse(
      res,
      200,
      "Project(s) fetched successfully",
      projectIds
    );
  } catch (error) {
    
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};

exports.getProjectsDetails = async (req, res) => {
  try {
    
    const { _id } = req.body;

    
    if (!_id) {
      return utils.commonResponse(res, 400, "Project ID (_id) is required");
    }

    
    const allprojects = await Project.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(_id),
        }
      },
      {
        $lookup: {
          from: "boxes",
          localField: "_id",
          foreignField: "projectID",
          as: "boxes",
          pipeline: [
            {
              $addFields: {
                quantity: {
                  $sum: {
                    $map: {
                      input: "$components",
                      as: "component",
                      in: "$$component.quantity"
                    }
                  }
                }
              }
            },
            {
              $project: {
                boxSerialNo: "$serialNo",
                status: "opend",
                quantity: 1
              }
            }
          ]
        }
      }
    ]);
      

    
    if (!allprojects.length) {
      return utils.commonResponse(res, 404, "No project found with the given ID");
    }

    
    utils.commonResponse(
      res,
      200,
      "Project details fetched successfully",
      allprojects[0] 
    );
  } catch (error) {
    
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};



//spoke


exports.getAllSpokeProjects = async (req, res) => {
  try {
    const { spokeId } = req.body;

   
    const query = spokeId ? { createdBy: spokeId } : {};

    const projectIds = await Project.find(query, {
      ProjectId: 1,
      _id: 1,
      ProjectName: 1,
      status: 1,
      ProjectDate: 1,
      createdBy: 1,
    });

    utils.commonResponse(
      res,
      200,
      "Projects fetched successfully",
      projectIds
    );
  } catch (error) {
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};

//spoke details

exports.getProjectsDetails = async (req, res) => {
  try {
    
    const { _id } = req.body;

    
    if (!_id) {
      return utils.commonResponse(res, 400, "Project ID (_id) is required");
    }

    
    const allprojects = await Project.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(_id),
        }
      },
      {
        $lookup: {
          from: "boxes",
          localField: "_id",
          foreignField: "projectId",
          as: "boxes",
          pipeline: [
            {
              $addFields: {
                quantity: {
                  $sum: {
                    $map: {
                      input: "$components",
                      as: "component",
                      in: "$$component.quantity"
                    }
                  }
                }
              }
            },
            {
              $project: {
                boxSerialNo: "$serialNo",
                status: "opend",
                quantity: 1
              }
            }
          ]
        }
      }
    ]);
      

    
    if (!allprojects.length) {
      return utils.commonResponse(res, 404, "No project found with the given ID");
    }

    
    utils.commonResponse(
      res,
      200,
      "Project details fetched successfully",
      allprojects[0] 
    );
  } catch (error) {
    
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};