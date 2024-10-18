const mongoose = require("mongoose");
const boxSerialNo = require("../Models/BoxSerialNo");
const utils = require("../controllers/utils");
const shortid = require("shortid");
const Project = require("../Models/Projects");
const ProjectBoxSerial = require("../Models/BoxSerialNo");
const Boxes = require("../Models/box");
const Component = require("../Models/Components.js");
const Hub = require("../Models/Hubs.js");

exports.generateBoxSerialNo = async (req, res) => {
  try {
    const { hubID, qnty } = req.body;

    if (!hubID || !qnty || typeof qnty !== "number" || qnty <= 0) {
      return utils.commonResponse(res, 400, "Invalid input parameters");
    }

    const existingBoxSerial = await boxSerialNo.findOne({ hubID });
    let serialCounter = existingBoxSerial
      ? existingBoxSerial.serialNos.length + 1
      : 1;

    const boxSerialNos = Array.from({ length: qnty }, () => {
      const serialNo = shortid.generate();
      const sixDigitNo = serialCounter.toString().padStart(6, "0");
      serialCounter += 1;
      return `${serialNo}${sixDigitNo}`;
    });

    if (existingBoxSerial) {
      await boxSerialNo.updateOne(
        { hubID },
        {
          $push: { serialNos: { $each: boxSerialNos } },
          $inc: { serialNoCount: qnty },
        }
      );
    } else {
      await boxSerialNo.create({
        hubID,
        serialNos: boxSerialNos,
        serialNoCount: qnty,
      });
    }

    utils.commonResponse(res, 200, "Box serial numbers generated", {
      hubID,
      boxSerialNos,
    });
  } catch (error) {
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};

exports.addBoxToProject = async (req, res) => {
  try {
    const { projectID, serialNo } = req.body;
    if (!projectID || !serialNo) {
      return utils.commonResponse(res, 400, "Invalid input parameters");
    }
    const existingBoxSerial = await boxSerialNo.findOne({
      serialNos: serialNo,
    });

    if (!existingBoxSerial) {
      return utils.commonResponse(res, 404, "Serial number not found");
    }
    const existingBox = await Boxes.findOne({
      projectId: projectID,
      serialNo,
    });

    if (existingBox) {
      return utils.commonResponse(
        res,
        409,
        "Box with this serial number already exists in the project"
      );
    }
    const box = await Boxes.create({
      projectId: new mongoose.Types.ObjectId(projectID),
      serialNo,
    });
    await Project.findByIdAndUpdate(
      projectID,
      { $addToSet: { boxSerialNumbers: serialNo } },
      { new: true }
    );
    utils.commonResponse(
      res,
      200,
      "Serial number connected to project successfully",
      {
        _id: box._id,
        boxSerialNo: box.serialNo,
        status: box.status,
        quantity: box.quantity,
      }
    );
  } catch (error) {
    console.error("Error in addBoxToProject:", error);
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};

const ComponentSerialNo = require("../Models/componentSerialNo.js");

exports.addComponentsToBox = async (req, res) => {
  try {
    const {
      hubID,
      componentID,
      boxSerialNo,
      projectID,
      componentSerialNumber,
    } = req.body;

    if (
      !hubID ||
      !componentID ||
      !boxSerialNo ||
      !projectID ||
      !componentSerialNumber
    ) {
      return utils.commonResponse(res, 400, "Invalid input parameters");
    }

    const box = await Boxes.findOne({ serialNo: boxSerialNo });
    if (!box) {
      return utils.commonResponse(res, 404, "Box serial number not found");
    }

    const component = await ComponentSerialNo.findOne({
      componentID: componentID,
    });
    if (!component) {
      return utils.commonResponse(res, 404, "Component ID not found");
    }

    const hub = await Hub.findById(hubID);
    if (!hub) {
      return utils.commonResponse(res, 404, "Hub ID not found");
    }

    const componentSerialEntry = await ComponentSerialNo.findOne({
      componentID: componentID,
      "hubSerialNo.hubID": hubID,
      "hubSerialNo.serialNos": componentSerialNumber,
    });

    if (!componentSerialEntry) {
      return utils.commonResponse(
        res,
        404,
        "Component Serial Number not found for the provided Component ID and Hub ID"
      );
    }
    const existingComponent = box.components.find(
      (comp) => comp.componentID && comp.componentID.equals(componentID)
    );

    if (existingComponent) {
      if (existingComponent.componentSerialNo.includes(componentSerialNumber)) {
        return utils.commonResponse(
          res,
          400,
          "Serial number already exists for this component in the box"
        );
      }
      existingComponent.componentSerialNo.push(componentSerialNumber);
      existingComponent.quantity = existingComponent.componentSerialNo.length;
    } else {
      box.components.push({
        componentID,
        componentName: component.componentName,
        componentSerialNo: [componentSerialNumber],
        quantity: 1,
      });
    }
    box.quantity += 1;
    await box.save();

    utils.commonResponse(res, 200, "Component added to box successfully", {
      boxid: box._id,
      totalComponents: box.quantity,
    });
  } catch (error) {
    console.error("Error in addComponentsToBox:", error);
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};

// exports.addComponentsToBox = async (req, res) => {
//   try {
//     const { hubID, componentID, boxSerialNo, projectID, componentSerialNumber } = req.body;

//     // Validate input parameters
//     if (!hubID || !componentID || !boxSerialNo || !projectID || !componentSerialNumber) {
//       return utils.commonResponse(res, 400, "Invalid input parameters");
//     }

//     // Find the box by its serial number
//     const box = await Boxes.findOne({ serialNo: boxSerialNo });
//     if (!box) {
//       return utils.commonResponse(res, 404, "Box serial number not found");
//     }

//     // Find the component by its ID
//     const component = await ComponentSerialNo.findOne({ componentID });
//     if (!component) {
//       return utils.commonResponse(res, 404, "Component ID not found");
//     }

//     // Validate the hub existence
//     const hub = await Hub.findById(hubID);
//     if (!hub) {
//       return utils.commonResponse(res, 404, "Hub ID not found");
//     }

//     // Ensure the component's serial number exists within the hub's data
//     const componentSerialEntry = await ComponentSerialNo.findOne({
//       componentID,
//       "hubSerialNo.hubID": hubID,
//       "hubSerialNo.serialNos": componentSerialNumber,
//     });

//     if (!componentSerialEntry) {
//       return utils.commonResponse(
//         res,
//         404,
//         "Component Serial Number not found for the provided Component ID and Hub ID"
//       );
//     }

//     // Find the existing component in the box
//     const existingComponent = box.components.find(
//       (comp) => comp.componentID.equals(componentID)
//     );

//     if (existingComponent) {
//       // Check if the serial number already exists for this project
//       const projectComponentExists = existingComponent.projectDetails?.some(
//         (proj) =>
//           proj.projectID === projectID &&
//           proj.componentSerialNo.includes(componentSerialNumber)
//       );

//       if (projectComponentExists) {
//         return utils.commonResponse(
//           res,
//           400,
//           "This component's serial number already exists for this project in the box"
//         );
//       }

//       // If the serial number is new for this project, add it to the project details
//       const project = existingComponent.projectDetails.find(
//         (proj) => proj.projectID === projectID
//       );

//       if (project) {
//         // Add the new serial number to the existing project entry
//         project.componentSerialNo.push(componentSerialNumber);
//       } else {
//         // Create a new project entry if it doesn't exist
//         existingComponent.projectDetails.push({
//           projectID,
//           componentSerialNo: [componentSerialNumber],
//         });
//       }

//       // Update the component's quantity
//       existingComponent.quantity = existingComponent.projectDetails.reduce(
//         (total, proj) => total + proj.componentSerialNo.length,
//         0
//       );
//     } else {
//       // Add a new component entry if it doesn't exist in the box
//       box.components.push({
//         componentID,
//         componentName: component.componentName,
//         projectDetails: [
//           {
//             projectID,
//             componentSerialNo: [componentSerialNumber],
//           },
//         ],
//         quantity: 1,
//       });
//     }

//     // Update the total quantity of components in the box
//     box.quantity = box.components.reduce((total, comp) => total + comp.quantity, 0);
//     await box.save();

//     // Send success response
//     utils.commonResponse(
//       res,
//       200,
//       "Component added to box successfully",
//       {
//         boxid: box._id,
//         totalComponents: box.quantity,
//       }
//     );

//   } catch (error) {
//     console.error("Error in addComponentsToBox:", error);
//     utils.commonResponse(res, 500, "Unexpected server error", error.toString());
//   }
// };

// exports.getBoxDetails = async (req, res) => {
//   try {

//     const { _id } = req.body;

//     const box = await Boxes.findOne({ _id});

//     if (!box) {
//       return utils.commonResponse(res, 404, "Box not found");
//     }

//      utils.commonResponse(res, 200, "Box fetched successfully", box

//     );

//      }

//    catch (error) {
//     utils.commonResponse(res, 500, "Unexpected server error", error.toString());
//   }
// };

exports.getBoxDetails = async (req, res) => {
  try {
    const { _id } = req.body;

    const box = await Boxes.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(_id),
        },
      },
      {
        $unwind: "$components",
      },
      {
        $lookup: {
          from: "components",
          localField: "components.componentID",
          foreignField: "_id",
          as: "componentDetails",
        },
      },
      {
        $unwind: "$componentDetails",
      },
      {
        $project: {
          _id: 1,
          status: 1,
          quantity: 1,
          serialNo: 1,
          "components.componentID": "$components.componentID",
          "components.serial": "$components.serial",
          "components.componentName": "$componentDetails.componentName",
          "components.quantity": "$components.quantity",
          "components._id": "$components._id",
        },
      },
      {
        $group: {
          _id: "$_id",
          status: {
            $first: "$status",
          },
          serialNo: {
            $first: "$serialNo",
          },
          quantity: {
            $first: "$quantity",
          },
          components: {
            $push: "$components",
          },
        },
      },
    ]);

    if (!box) {
      return utils.commonResponse(res, 404, "Box not found");
    } else {
    }
    console.log(box);
    utils.commonResponse(res, 200, "Box fetched successfully", box[0]);
  } catch (error) {
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};

// Customers.findOneAndUpdate(
//   {
//     _id: mongoose.Types.ObjectId(customerID),
//     cart: {
//       $elemMatch: {
//         itemID: mongoose.Types.ObjectId(itemID),
//         flavour: flavour,
//         packageWeight: packageWeight,
//       },
//     },
//   },
//   {
//     $inc: {
//       "cart.$.qnty": qnty,
//       "cart.$.freebiePoints":
//         (existingProductIncartPoints.freebiePoints /
//           existingProductIncartPoints.qnty) *
//         qnty,
//     },
//        }
//       )
