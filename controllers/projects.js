const mongoose = require("mongoose");
const Project = require("../Models/Projects");
const utils = require("../controllers/utils");
const Boxes = require("../Models/box");

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
        },
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
                      in: "$$component.quantity",
                    },
                  },
                },
              },
            },
            {
              $project: {
                boxSerialNo: "$serialNo",
                status: "opend",
                quantity: 1,
              },
            },
          ],
        },
      },
    ]);

    if (!allprojects.length) {
      return utils.commonResponse(
        res,
        404,
        "No project found with the given ID"
      );
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

    utils.commonResponse(res, 200, "Projects fetched successfully", projectIds);
  } catch (error) {
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};

//spoke details

exports.getSpokeProjectsDetails = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return utils.commonResponse(res, 400, "(_id) is required");
    }

    const allprojects = await Project.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(_id),
        },
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
                      in: "$$component.quantity",
                    },
                  },
                },
              },
            },
            {
              $project: {
                boxSerialNo: "$serialNo",
                status: "opend",
                quantity: 1,
              },
            },
          ],
        },
      },
    ]);

    if (!allprojects.length) {
      return utils.commonResponse(
        res,
        404,
        "No project found with the given ID"
      );
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

exports.shipProject = async (req, res) => {
  try {
    projectId = req.body.projectId;

    projectComponents = await Project.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $project: {
          "switchBoardData.components": 1,
        },
      },
      {
        $unwind: {
          path: "$switchBoardData",
        },
      },
      {
        $unwind: {
          path: "$switchBoardData.components",
        },
      },
      {
        $project: {
          components: "$switchBoardData.components",
        },
      },
      {
        $project: {
          reference: "$components.Reference",
          components: 1,
        },
      },
      {
        $group: {
          _id: "$reference",
          qnty: {
            $sum: "$components.Quantity",
          },
        },
      },
      {
        $project: {
          _id: 0,
          reference: "$_id",
          qnty: 1,
        },
      },
    ]);

    BoxComponenets = await Boxes.aggregate([
      {
        $match: {
          projectID: new mongoose.Types.ObjectId("66fe2ba7e4ae95af59d2f0c9"),
        },
      },
      {
        $project: {
          _id: 0,
          components: 1,
        },
      },
      {
        $unwind: {
          path: "$components",
        },
      },
      {
        $group: {
          _id: "$components.componentName",
          qnty: {
            $sum: "$components.quantity",
          },
        },
      },
      {
        $project: {
          _id: 0,
          reference: "$_id",
          qnty: 1,
        },
      },
    ]);

    
     missingComponents = []
      projectComponents.map((projectComponent) => {
      BoxComponenets.map((boxComponent) => {
        if (projectComponent.reference === boxComponent.reference) {
          if (projectComponent.qnty != boxComponent.qnty) {
            missingComponents.push({
              reference: projectComponent.reference,
              qnty: projectComponent.qnty - boxComponent.qnty,
            });
          }
        }
      }).filter((notUndefined) => notUndefined !== undefined);
      if(!BoxComponenets.some((boxitem)=>boxitem.reference==projectComponent.reference))
        missingComponents.push(projectComponent);
    }).filter((notUndefined) => notUndefined !== undefined);

if(missingComponents.length>0){
  utils.commonResponse(res, 201, "The project cannot be shipped as the following items are not shipped", missingComponents);
}else{

  await Project.updateOne(
    { _id: new mongoose.Types.ObjectId(projectId) },
    { $set: { status: "shipped" } }
  );

  utils.commonResponse(res, 200, "The project has been shipped successfully");
}

    
  } catch (error) {
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};
