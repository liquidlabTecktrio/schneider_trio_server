const mongoose = require("mongoose");
const boxSerialNo = require("../Models/BoxSerialNo");
const utils = require("../controllers/utils");
const shortid = require("shortid");
const Project = require("../Models/Projects");
const ProjectBoxSerial = require("../Models/BoxSerialNo");
const Boxes = require("../Models/box");



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
    //kishore
    const boxes = await Boxes.create({
      projectID: new mongoose.Types.ObjectId(projectID),
      serialNo,
    });

    // await boxes.save();

    await Project.findByIdAndUpdate(
      projectID,
      { $addToSet: { boxSerialNumbers: serialNo } },
      { new: true }
    );

    utils.commonResponse(
      res,
      200,
      "Serial number connected to project successfully",
      { projectID, serialNo }
    );
  } catch (error) {
    console.error("Error in addBoxToProject:", error);
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};

exports.addComponentsToSerialNumbers = async (req, res) => {
  try {
    const { componentName } = req.body;

    // Validate input
    if (
      !componentName ||
      !Array.isArray(componentName) ||
      componentName.length === 0
    ) {
      return utils.commonResponse(res, 400, "Invalid input parameters");
    }

    for (const component of componentName) {
      const { componentName, serialNo, quantity } = component;

      // Validate each component's details
      if (!componentName || !serialNo || !quantity || quantity <= 0) {
        return utils.commonResponse(res, 400, "Invalid component data");
      }

      // Find the document by serialNo in the Boxes model
      const existingSerial = await boxes.findOne({ serialNo });

      if (!existingSerial) {
        return utils.commonResponse(
          res,
          404,
          `Serial number ${serialNo} not found`
        );
      }

      // Check if the component already exists in the components array
      const existingComponent = existingSerial.components.find(
        (comp) => comp.componentName === componentName
      );

      if (existingComponent) {
        // If the component exists, update the quantity
        existingComponent.quantity += quantity;

        // Check if serialNos is an array, and push serialNo only if not already present
        if (!existingComponent.serialNos.includes(serialNo)) {
          existingComponent.serialNos.push(serialNo); // Ensure it's unique
        }
      } else {
        // If the component doesn't exist, add it to the components array
        existingSerial.components.push({
          componentName,
          serialNos: [serialNo], // Wrap serialNo in an array
          quantity,
        });
      }

      // Save the updated document
      await existingSerial.save();
    }

    // Send a success response
    utils.commonResponse(res, 200, "Components added/updated successfully");
  } catch (error) {
    // Handle errors
    console.error("Error in addComponentsToSerialNumbers:", error);
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};
 