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
    const { hubID, componentID, boxSerialNo, projectID, componentSerialNumber } = req.body;
    if (!hubID || !componentID || !boxSerialNo || !projectID || !componentSerialNumber) {
      return utils.commonResponse(res, 400, "Invalid input parameters");
    }
    const box = await Boxes.findOne({ serialNo: boxSerialNo });
    if (!box) {
      return utils.commonResponse(res, 404, "Box serial number not found");
    }
    const component = await ComponentSerialNo.findOne({componentID:componentID });
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
      "hubSerialNo.serialNos": componentSerialNumber 
    });

    if (!componentSerialEntry) {
      return utils.commonResponse(res, 404, "Component Serial Number not found for the provided Component ID and Hub ID");
    }
    const updatedBox = await Boxes.findOneAndUpdate(
      { serialNo: boxSerialNo, "components.componentID": componentID },
      {
        $addToSet: {
          "components.$.componentSerialNo": componentSerialNumber,
        },
      },
      { new: true }
    );

    if (updatedBox) {
      const componentIndex = updatedBox.components.findIndex(comp => comp.componentID.equals(componentID));
      updatedBox.components[componentIndex].quantity = updatedBox.components[componentIndex].componentSerialNo.length; 
      await updatedBox.save();
    } else {
      await Boxes.updateOne(
        { serialNo: boxSerialNo },
        {
          $push: {
            components: {
              componentID,
              componentName: component.componentName, 
              componentSerialNo: [componentSerialNumber], 
              quantity: 1 
            }
          }
        }
      );
    }

   
    const finalBox = await Boxes.findOne({ serialNo: boxSerialNo });
    finalBox.quantity = finalBox.components.length;
    await finalBox.save();
    utils.commonResponse(
      res,
      200,
      "Component added to box successfully",
      {
        boxid: finalBox._id,
        // boxSerialNo,
        // components: finalBox.components.map(comp => ({
        //   componentID: comp.componentID,
        //   componentSerialNo: comp.componentSerialNo,
        //   quantity: comp.quantity,
        // })),
        totalComponents: finalBox.quantity 
      }
    );

  } catch (error) {
    console.error("Error in addComponentsToBox:", error);
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};





exports.getAllBoxes = async (req, res) => {
  try {
    
    const AllBoxes = await Boxes.aggregate([
      {
        $match: {
          _id: new mongoose.Types. ObjectId("66ffd7a836f6018dcbcc5de4")
        }
      },
      
    ])
     
    utils.commonResponse(
      res,
      200,
      "All boxes fetched successfully",
      AllBoxes
      
    );
  } catch (error) {
    utils.commonResponse(res, 500, "unexpected server error", error.toString());
  }
};


