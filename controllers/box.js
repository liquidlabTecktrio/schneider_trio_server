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








//     if (
//       !componentName ||
//       !Array.isArray(componentName) ||
//       componentName.length === 0
//     ) {
//       return utils.commonResponse(res, 400, "Invalid input parameters");
//     }

//     for (const component of componentName) {
//       const { componentName, serialNo, componentSerialNo, quantity } =
//         component;

//       // Validate each component's details
//       if (
//         !componentName ||
//         !serialNo ||
//         !componentSerialNo ||
//         !quantity ||
//         quantity <= 0
//       ) {
//         return utils.commonResponse(res, 400, "Invalid component data");
//       }

//       // Find the document by serialNo in the Boxes model
//       const existingSerial = await Boxes.findOne({ serialNo });

//       if (!existingSerial) {
//         return utils.commonResponse(
//           res,
//           404,
//           `Serialnumber ${serialNo} not found`
//         );
//       }

//       // Check if the component already exists in the components array
//       const existingComponent = existingSerial.components.find(
//         (comp) => comp.componentName === componentName
//       );

//       if (existingComponent) {
//         // If the component exists, update the quantity
//         existingComponent.quantity += quantity;

//         // Check if componentSerialNo is an array, and push the componentSerialNo only if not already present
//         if (!existingComponent.componentSerialNo.includes(componentSerialNo)) {
//           existingComponent.componentSerialNo.push(componentSerialNo); // Ensure it's unique
//         }
//       } else {
//         // If the component doesn't exist, add it to the components array
//         existingSerial.components.push({
//           componentName,
//           serialNos: [serialNo], // Keep serialNo array intact
//           componentSerialNo: [componentSerialNo], // Wrap componentSerialNo in an array
//           quantity,
//         });
//       }

//       // Save the updated document
//       await existingSerial.save();
//     }

//     // Send a success response
//     utils.commonResponse(res, 200, "Components added/updated successfully");
//   } catch (error) {
//     // Handle errors
//     console.error("Error in addComponentsToSerialNumbers:", error);
//     utils.commonResponse(res, 500, "Unexpected server error", error.toString());
//   }
// };

const ComponentSerialNos = require("../Models/componentSerialNo.js"); 

exports.addComponentsToBox = async (req, res) => {
  try {
    const { componentSerialNo, _id } = req.body;
    
 
    if (!_id || !componentSerialNo) {
      return utils.commonResponse(res, 400, "Invalid input parameters");
    }
    
    const isValidSerial = await ComponentSerialNos.findOne({
      "hubSerialNo.serialNos": componentSerialNo,
    });

    if (!isValidSerial) {
      return utils.commonResponse(
        res,
        400,
        `Component Serial Number ${componentSerialNo} is not valid`
      );
    }

    const existingBox = await Boxes.findById(_id);
    if (!existingBox) {
      return utils.commonResponse(res, 404, `Box with ID ${_id} not found`);
    }

    const existingComponent = existingBox.components.find(
      (comp) => comp.componentSerialNo === componentSerialNo
    );

    if (existingComponent) {
      return utils.commonResponse(
        res,
        400,
        `Component with Serial Number ${componentSerialNo} already exists in the box`
      );
    } else {
      existingBox.components.push({
        componentSerialNo,
        quantity: 1,        
      });
    }

    
    await existingBox.save();
    utils.commonResponse(res, 200, "Component added successfully",
      {
        _id: existingBox._id,
        
        status: existingBox.status,
        
        quantity: existingBox.quantity,

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


