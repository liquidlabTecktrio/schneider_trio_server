const mongoose = require("mongoose");
const Project = require("../Models/Projects");
const utils = require("../controllers/utils");
const Boxes = require("../Models/box");
const ComponentSerial = require("../Models/componentSerialNo");
const Component = require("../Models/Components");
const Projects = require("../Models/Projects");

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

exports.createNewOrderFromHub = async (req, res) => {
  try {
    let data = req.body

    let switchBoards = data.switchBoards
    // console.log('cr list', data.switchBoards)
    let hub_id = data.hub_id
    let spoke_id = data.spoke_id
    let project_name = data.project_name



    // switchBoards.map((swt, key)=>{
    //   swt.components.map((cr,key)=>{
    //     console.log(cr)

    //   })

    // })
    // order data contain list of cr s and the parts in it
    // console.log(order_data)
    // console.log(hub_id)
    // console.log(spoke_id)
    // console.log(project_name)

    // console.log(data)
    //   const BOMPerSB = sheet.sheetsByIndex[sheetIndex];
    //   const BOMPerSB_Rows = await BOMPerSB.getRows({ options: { offset: 1 } });
    //   BOM_data = [];
    //   await Bluebird.each(BOMPerSB_Rows, async (rowData, _rowIndex) => {
    //     _rowData = rowData.toObject();

    //     BOM_data.push(_rowData);23
    //   });

    //   switch_board = collect(
    //     BOM_data.filter((BOM_row) => {
    //       return BOM_row.Enclosure == "Common Total";
    //     })
    //   ).pluck("SwitchBoard").items;

    // switchboards = [];

    // order_data.forEach((sb) => {
    //   console.log('sb', sb)
    //   sb_data = {
    //     switchBoard: sb.referenceNumber,
    //     components: [],
    //   };

    //   sb.parts.forEach((cr) => {
    //     // if (element.SwitchBoard == sb) {
    //     //   if (element.Reference != "") {
    //     // console.log('element',element)

    //     sb_data.components.push(cr);

        
    //     //   }
    //     // }
    //   });
    //   // switchborad_data.push('sb_data',sb_data);
    // });

    // console.log(switchborad_data)



    // await Projects.create({
    //   ProjectName: project_name,
    //   // // ProjectID: req.body.projectId,
    //   createdBy: spoke_id,
    //   createdTo: hub_id,
    //   status: "open",
    //   switchBoardData: switchborad_data,
    // });

    let newProjectData = {
      ProjectName: project_name,
      // Description:
      createdBy: spoke_id,
      createdTo: hub_id,
      status: "open",
      switchBoardData: switchBoards,
    }
    console.log("creating new project...")
    await Projects.create(newProjectData);
    console.log("project creation completed")

    utils.commonResponse(res, 200, "success", {});


  } catch (error) {
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};

exports.getOpenProjects = async (req, res) => {
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
          ProjectName: { $first: "$ProjectName" },
          createdBy: { $first: "$createdBy" },
          status: { $first: "$status" },
          totalComponents: { $sum: "$switchBoardData.components.Quantity" },
        },
      },
      {
        $match: {
          status: "open", // Filter for projects where the status is "open"
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
      projectId: new mongoose.Types.ObjectId(project._id),
      components: {
        $elemMatch: { componentID: new mongoose.Types.ObjectId(component._id) },
      },
      components: {
        $elemMatch: { componentSerialNo: serialNo },
      },
      // componentSerialNo: serialNo,
    });

    // Retrieve serial number if the box is found
    const boxSerialNo = box ? box.serialNo : null;

    if (!boxSerialNo) {
      return res
        .status(401)
        .json({ message: "Invalid QRCode or Invalid Serial Number" });
    }

    // Success: return project, switch board details, and box serial number
    return res.status(200).json({
      projectName: project.ProjectName,
      projectID: project._id,
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
        _id: new mongoose.Types.ObjectId(projectID),
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
    const { projectId } = req.body;

    // Step 1: Retrieve Project Components and Calculate Required Quantities
    // const projectComponents = await Project.aggregate([
    //   { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
    //   { $project: { "switchBoardData.components": 1 } },
    //   { $unwind: "$switchBoardData" },
    //   { $unwind: "$switchBoardData.components" },
    //   {
    //     $lookup: {
    //       from: "parts",
    //       localField: "switchBoardData.components.Reference",
    //       foreignField: "parentIds.crNumber",
    //       as: "partDetails",
    //     },
    //   },
    //   { $unwind: "$partDetails" },
    //   {
    //     $project: {
    //       reference: "$switchBoardData.components.Reference",
    //       requiredQuantity: {
    //         $multiply: ["$switchBoardData.components.Quantity", "$partDetails.quantity"],
    //       },
    //       partNumber: "$partDetails.partNumber",
    //       partDescription: "$partDetails.partDescription",
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: { reference: "$reference", partNumber: "$partNumber", partDescription: "$partDescription" },
    //       totalRequiredQuantity: { $sum: "$requiredQuantity" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       reference: "$_id.reference",
    //       partNumber: "$_id.partNumber",
    //       partDescription: "$_id.partDescription",
    //       totalRequiredQuantity: 1,
    //     },
    //   },
    // ]);

    const projectComponents = await Project.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(projectId)
        } // Match the project ID
      },
      {
        $unwind: "$switchBoardData" // Unwind switchBoardData
      },
      {
        $unwind: "$switchBoardData.components" // Unwind components within switchBoardData
      },
      {
        $unwind: "$switchBoardData.components.parts" // Unwind parts within components
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            parts:
              "$switchBoardData.components.parts",
            _id: 0
          }
      },
      // {
      //   $project: {
      //     isComponentExist: {
      //       $literal: true
      //     } // If a match is found, return true
      //   }
      // }
    ])


    console.log('projectComponents: ', projectComponents);

    // Step 2: Fetch Shipped Components from Boxes
    const boxComponents = await Boxes.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
      { $unwind: "$components" },
      {
        $group: {
          _id: "$components.componentName",
          totalShippedQuantity: { $sum: "$components.quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          partNumber: "$_id", // componentName in boxes is partNumber from parts
          totalShippedQuantity: 1,
        },
      },
    ]);

    console.log('boxComponents: ', boxComponents);
    // Step 3: Compare Required and Shipped Quantities
    const missingComponents = [];
    const boxComponentsMap = new Map(boxComponents.map(comp => [comp.partNumber, comp.totalShippedQuantity]));

    projectComponents.forEach((projectComponent) => {
      const shippedQuantity = boxComponentsMap.get(projectComponent.partNumber) || 0;
      if (shippedQuantity < projectComponent.totalRequiredQuantity) {
        missingComponents.push({
          reference: projectComponent.reference,
          partNumber: projectComponent.partNumber,
          partDescription: projectComponent.partDescription,
          qnty: projectComponent.totalRequiredQuantity - shippedQuantity,
        });
      }
    });

    // Step 4: Respond Based on Missing Components
    if (missingComponents.length > 0) {
      return utils.commonResponse(
        res,
        201,
        "The project cannot be shipped as the following items are not shipped",
        missingComponents
      );
    } else {
      // Update Project Status to Shipped
      await Project.updateOne(
        { _id: new mongoose.Types.ObjectId(projectId) },
        { $set: { status: "shipped" } }
      );

      return utils.commonResponse(res, 200, "The project has been shipped successfully");
    }
  } catch (error) {
    console.error("Error in shipProject:", error);
    return utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};


// exports.shipProject = async (req, res) => {
//   try {
//     projectId = req.body.projectId;

//     projectComponents = await Project.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(projectId),
//         },
//       },
//       {
//         $project: {
//           "switchBoardData.components": 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$switchBoardData",
//         },
//       },
//       {
//         $unwind: {
//           path: "$switchBoardData.components",
//         },
//       },
//       {
//         $project: {
//           components: "$switchBoardData.components",
//         },
//       },
//       {
//         $project: {
//           reference: "$components.Reference",
//           components: 1,
//         },
//       },
//       {
//         $group: {
//           _id: "$reference",
//           qnty: {
//             $sum: "$components.Quantity",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           reference: "$_id",
//           qnty: 1,
//         },
//       },
//     ]);

//     BoxComponenets = await Boxes.aggregate([
//       {
//         $match: {
//           projectId: new mongoose.Types.ObjectId(projectId),
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           components: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$components",
//         },
//       },
//       {
//         $group: {
//           _id: "$components.componentName",
//           qnty: {
//             $sum: "$components.quantity",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           reference: "$_id",
//           qnty: 1,
//         },
//       },
//     ]);

//     missingComponents = [];
//     projectComponents
//       .map((projectComponent) => {
//         BoxComponenets.map((boxComponent) => {
//           if (projectComponent.reference === boxComponent.reference) {
//             if (projectComponent.qnty != boxComponent.qnty) {
//               missingComponents.push({
//                 reference: projectComponent.reference,
//                 qnty: projectComponent.qnty - boxComponent.qnty,
//               });
//             }
//           }
//         }).filter((notUndefined) => notUndefined !== undefined);
//         if (
//           !BoxComponenets.some(
//             (boxitem) => boxitem.reference == projectComponent.reference
//           )
//         )
//           missingComponents.push(projectComponent);
//       })
//       .filter((notUndefined) => notUndefined !== undefined);

//     if (missingComponents.length > 0) {
//       utils.commonResponse(
//         res,
//         201,
//         "The project cannot be shipped as the following items are not shipped",
//         missingComponents
//       );
//     } else {
//       await Project.updateOne(
//         { _id: new mongoose.Types.ObjectId(projectId) },
//         { $set: { status: "shipped" } }
//       );

//       utils.commonResponse(
//         res,
//         200,
//         "The project has been shipped successfully"
//       );
//     }
//   } catch (error) {
//     utils.commonResponse(res, 500, "Unexpected server error", error.toString());
//   }
// };

exports.getProjectDetailsWithParts = async (req, res) => {
  try {
    const projectId = req.body.projectId;

    // console.log(await Project.findOne({_id: new mongoose.Types.ObjectId(projectId)}))

    projectDetails = await Project.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(projectId),
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
      {
        $unwind: "$switchBoardData",
      },
      {
        $unwind: "$switchBoardData.components",
      },
      // {
      //   $lookup: {
      //     from: "commercialreferences",
      //     localField: "switchBoardData.components.Reference",
      //     foreignField: "referenceNumber",
      //     as: "commercialReferenceData",
      //   },
      // },
      {
        $project: {
          "switchBoardData.components.Reference": 0,
          "switchBoardData.components.Description": 0,
          // "switchBoardData.components.parts": 1,
          // "switchBoardData.components.Quantity": 0,
        },
      },
      // {
      //   $unwind: {
      //     path: "$commercialReferenceData",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $addFields: {
      //     "switchBoardData.components": {
      //       $mergeObjects: [
      //         "$switchBoardData.components",
      //         {
      //           referenceNumber: "$commercialReferenceData.referenceNumber",
      //           description: "$commercialReferenceData.description",
      //           parts: "$commercialReferenceData.parts",
      //           productNumber: "$commercialReferenceData.productNumber",
      //         },
      //       ],
      //     },
      //   },
      // },
      {
        $group: {
          _id: {
            projectId: "$_id",
            switchBoard: "$switchBoardData.switchBoard",
          },
          ProjectName: {
            $first: "$ProjectName",
          },
          createdBy: {
            $first: "$createdBy",
          },
          boxes: {
            $first: "$boxes",
          },
          createdTo: {
            $first: "$createdTo",
          },
          boxSerialNumbers: {
            $first: "$boxSerialNumbers",
          },
          status: {
            $first: "$status",
          },
          components: {
            $push: "$switchBoardData.components",
          },
        },
      },
      {
        $group: {
          _id: "$_id.projectId",
          ProjectName: {
            $first: "$ProjectName",
          },
          createdBy: {
            $first: "$createdBy",
          },
          createdTo: {
            $first: "$createdTo",
          },
          status: {
            $first: "$status",
          },
          switchBoardData: {
            $push: {
              switchBoard: "$_id.switchBoard",
              components: "$components",
            },
          },
          boxSerialNumbers: {
            $first: "$boxSerialNumbers",
          },
          boxes: {
            $first: "$boxes",
          },
        },
      },
    ]);
    if (!((projectDetails ?? []).length > 0)) {
      return utils.commonResponse(res, 404, "project not found");
    }

    return utils.commonResponse(
      res,
      200,
      "project details fetched successfully",
      projectDetails[0]
    );
  } catch (error) {
    return utils.commonResponse(res, 500, error.toString());
  }
};
