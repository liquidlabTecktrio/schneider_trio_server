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

exports.addComponentsToBox1 = async (req, res) => {
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
async function checkComponentQuntityExceeded(
  totalQuantity,

  reference,
  projectId
) {
  console.log("totalQuantity: ", totalQuantity);
  console.log("reference: ", reference);
  console.log("projectId: ", projectId);

  var isExceedded = false;
  const checkQuntity = await Project.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $unwind: "$switchBoardData",
    },
    {
      $unwind: "$switchBoardData.components",
    },
    {
      $match: {
        "switchBoardData.components.Reference": reference,
      },
    },
    {
      $group: {
        _id: new mongoose.Types.ObjectId(projectId),
        totalQuantity: {
          $sum: "$switchBoardData.components.Quantity",
        },
      },
    },
    {
      $project: {
        isQuantityExceeded: {
          $lte: ["$totalQuantity", totalQuantity],
        },
      },
    },
  ]);

  if (checkQuntity.length > 0) {
    return (isExceedded = checkQuntity[0].isQuantityExceeded ?? false);
  } else {
    return isExceedded;
  }
}
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
    // console.log("componentID: ", componentID);
    // console.log("component: ", component);
    const componentName = await Component.findOne({
      _id: new mongoose.Types.ObjectId(componentID),
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
    const allProjectBasedBoxes = await Boxes.find({
      projectId: new mongoose.Types.ObjectId(projectID),
    });

    for (const serialBox of allProjectBasedBoxes) {
      const existingComponent = serialBox.components.find(
        (comp) => comp.componentID && comp.componentID.equals(componentID)
      );

      if (existingComponent) {
        if (
          existingComponent.componentSerialNo.includes(componentSerialNumber)
        ) {
          return utils.commonResponse(
            res,
            400,
            "Serial number already exists for this component in the box"
          );
        }

        // Add the serial number and update the quantity
        existingComponent.componentSerialNo.push(componentSerialNumber);
        existingComponent.quantity = existingComponent.componentSerialNo.length;

        // // Save the updated box
        // await serialBox.save();
      }
    }

    // else {
    box.components.push({
      componentID,
      componentName: componentName.componentName,
      componentSerialNo: [componentSerialNumber],
      quantity: 1,
    });
    // }
    console.log(projectID, componentID);
    const totalComponentsQuantity = await Boxes.aggregate([
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectID),
        },
      },
      {
        $unwind: "$components",
      },
      {
        $match: {
          "components.componentID": new mongoose.Types.ObjectId(componentID),
        },
      },
      {
        $group: {
          _id: "$components.componentID",
          totalQuantity: {
            $sum: "$components.quantity",
          },
        },
      },
    ]);

    const isExeed = await checkComponentQuntityExceeded(
      totalComponentsQuantity.length > 0
        ? totalComponentsQuantity[0].totalQuantity ?? 0
        : 0,
      componentName.componentName,
      projectID
    );
    if (isExeed) {
      return utils.commonResponse(
        res,
        201,
        "The ordered quantity of this item has been added to the box."
      );
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
          "components.compDescription": "$componentDetails.compDescription",
        },
      },
      {
        $group: {
          _id: {
            projectId: "$_id",
            componentName: "$components.componentName",
          },
          status: { $first: "$status" },
          serialNo: { $first: "$serialNo" },
          quantity: { $first: "$quantity" },
          totalQuantity: { $sum: "$components.quantity" },
          component: {
            $first: {
              componentID: "$components.componentID",
              serial: "$components.serial",
              componentName: "$components.componentName",
              compDescription: "$components.compDescription",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.projectId",
          status: { $first: "$status" },
          serialNo: { $first: "$serialNo" },
          quantity: { $first: "$quantity" },
          components: {
            $push: {
              componentID: "$component.componentID",
              serial: "$component.serial",
              componentName: "$component.componentName",
              compDescription: "$component.compDescription",
              quantity: "$totalQuantity",
            },
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

exports.closeBoxes = async (req, res) => {
  try {
    const { _id, status } = req.body;

    if (!_id || !status) {
      utils.commonResponse(res, 400, "Both _id and status are required.");
    }

    const validStatuses = ["open", "closed"];
    if (!validStatuses.includes(status)) {
      utils.commonResponse(
        res,
        400,
        "Invalid status. Must be 'open' or 'closed'."
      );
    }

    const updatedBoxes = await Boxes.findOneAndUpdate(
      { _id },
      { status },
      { new: true }
    );

    if (!updatedBoxes) {
      utils.commonResponse(res, 404, "Boxes not found.");
    }

    utils.commonResponse(res, 200, "Boxes closed successfully");
  } catch (error) {
    console.error("Error closing the boxes:", error);
    utils.commonResponse(res, 500, "Internal server error.");
  }
};
