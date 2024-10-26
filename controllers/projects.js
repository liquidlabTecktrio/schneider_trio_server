const mongoose = require("mongoose");
const Project = require("../Models/Projects");
const utils = require("../controllers/utils");
const Boxes = require("../Models/box");
const ComponentSerial = require("../Models/componentSerialNo");
const Component = require("../Models/Components");

exports.getAllProjects = async (req, res) => {
  try {
    const { _id } = req.body;
    const query = _id ? { _id: new mongoose.Types.ObjectId(_id) } : {};
    const projectIds = await Project.aggregate([
      {
        $unwind: {
          path: "$switchBoardData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$switchBoardData.components",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          ProjectName: {
            $first: "$ProjectName",
          },
          createdBy: {
            $first: "$createdBy",
          },
          status: {
            $first: "$status",
          },
          totalComponents: {
            $sum: "$switchBoardData.components.Quantity",
          },
        },
      },
      {
        $lookup: {
          from: "spokes",
          localField: "createdBy",
          foreignField: "_id",
          as: "spokeName",
          pipeline: [
            {
              $project: {
                spokeName: 1,
                // Only include 'spokeName' field from 'spokes'
                _id: 0, // Exclude '_id' from the result
              },
            },
          ],
        },
      },
      {
        $addFields: {
          spokeName: {
            $arrayElemAt: ["$spokeName.spokeName", 0], // Extract the first element from the array
          },
        },
      },
    ]);

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
                status: 1,
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

exports.getComponentScanResult = async (req, res) => {
  try {
    const { componentID, serialNo } = req.body;

    // Step 1: Retrieve component details
    const component = await Component.findById(componentID);
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    const componentName = component.componentName;

    // Step 2: Check component serial number validity
    const componentSerial = await ComponentSerial.findOne({
      componentID,
      "hubSerialNo.serialNos": serialNo,
    });
    if (!componentSerial) {
      return res.status(404).json({
        message: "Serial number not found for the given component",
      });
    }

    // Step 3: Find project containing the component by reference in any switchBoardData object
    const project = await Project.findOne({
      "switchBoardData.components.Reference": componentName,
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Component not found in any project" });
    }

    // Step 4: Filter switchBoardData array to find all instances with the matching component reference
    const matchingSwitchBoards = project.switchBoardData
      .filter((board) =>
        board.components.some(
          (component) => component.Reference === componentName
        )
      )
      .map((board) => {
        const matchedComponent = board.components.find(
          (comp) => comp.Reference === componentName
        );
        return {
          switchBoardName: board.switchBoard,
          quantity: matchedComponent.Quantity,
          fixedQuantity: matchedComponent.FixedQuantity,
        };
      });

    // Step 5: Find relevant box containing the component and project details
    const box = await Boxes.findOne({
      projectId: project._id,
      components: { $elemMatch: { componentID: component._id } },
      componentSerialNo:serialNo,
    });

    // Retrieve serial number if the box is found
    const boxSerialNo = box ? box.serialNo : null;

    if(!boxSerialNo){
      res.status(401).json({message:"Invalid QRCode or Invalid Serial Number"})
    }

    // Success: return project, switch board details, and box serial number
    return res.status(200).json({
      projectName: project.ProjectName,
      projectID: project.ProjectID,
      componentName,
      boxSerialNo,
      componentDescription: component.compDescription,
      switchBoardData: matchingSwitchBoards,
      boxSerialNo, // Include box serial number here
    });
  } catch (error) {
    console.error("Error finding component:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getincrementFixedQuantity = async (req, res) => {
  const { projectID, switchBoard, reference } = req.body;

  // Validate input
  if (!projectID || !switchBoard || !reference) {
    return res
      .status(400)
      .json({ error: "project_id, switchBoard, and reference are required" });
  }

  try {
    const result = await Project.updateOne(
      {
        _id:new mongoose.Types.ObjectId(projectID),
        "switchBoardData.switchBoard": switchBoard,
        "switchBoardData.components.Reference": reference,
      },
      {
        $inc: {
          "switchBoardData.$[board].components.$[comp].FixedQuantity": 1,
        },
      },
      {
        arrayFilters: [
          { "board.switchBoard": switchBoard },
          { "comp.Reference": reference },
        ],
      }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "No matching document found or already incremented" });
    }

    res.status(200).json({ message: "FixedQuantity incremented successfully" });
  } catch (error) {
    console.error("Error updating FixedQuantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
          projectId: new mongoose.Types.ObjectId(projectId),
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

    missingComponents = [];
    projectComponents
      .map((projectComponent) => {
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
        if (
          !BoxComponenets.some(
            (boxitem) => boxitem.reference == projectComponent.reference
          )
        )
          missingComponents.push(projectComponent);
      })
      .filter((notUndefined) => notUndefined !== undefined);

    if (missingComponents.length > 0) {
      utils.commonResponse(
        res,
        201,
        "The project cannot be shipped as the following items are not shipped",
        missingComponents
      );
    } else {
      await Project.updateOne(
        { _id: new mongoose.Types.ObjectId(projectId) },
        { $set: { status: "shipped" } }
      );

      utils.commonResponse(
        res,
        200,
        "The project has been shipped successfully"
      );
    }
  } catch (error) {
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};
