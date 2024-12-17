const componentSerialNo = require("../Models/componentSerialNo.js");
const partSerialNo = require("../Models/PartsSerialNo.js");
const parts = require("../Models/Parts.js");
const panelSerialNo = require("../Models/panelSerialNo");
const Components = require("../Models/Components");
const Panels = require("../Models/Panels");
const utils = require("../controllers/utils");
const shortid = require("shortid");
const { default: mongoose } = require("mongoose");

exports.generateComponentSerialNo = async (req, res) => {
  try {
    const { hubID, componentID, qnty } = req.body;

    const arr1 = new Array(qnty).fill(0).map((x) => shortid.generate(6));

    componentSerialNo
      .findOneAndUpdate(
        {
          componentID: componentID,
          hubSerialNo: {
            $elemMatch: {
              hubID: hubID,
            },
          },
        },
        {
          $inc: { "hubSerialNo.$.serialNo": qnty },
          $push: { "hubSerialNo.$.serialNos": { $each: arr1 } },
        },
        { returnNewDocument: true }
      )
      .then(async (compenetSerial) => {
        //console.log("generated");
        if (!compenetSerial) {
          await componentSerialNo.findOneAndUpdate(
            { componentID: componentID },
            {
              $push: {
                hubSerialNo: { hubID: hubID, serialNo: qnty, serialNos: arr1 },
              },
            },
            { upsert: true } //this line will add new document if the component is not already present in the ComponentSerialNo collection
          );
        }

        const component = await Components.findById({ _id: componentID });
        utils.commonResponse(res, 200, "Component serial number generated", {
          hubID: hubID,
          componentID: componentID,
          serialNos: arr1,
          compShortName:
            component != null
              ? `${component.compShortName} \n ${component.compDescription}`
              : "",
        });
      });
  } catch (error) {
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};

exports.generatePartSerialNo = async (req, res) => {

  console.log('generate',req.body)
  try {
    const { hubID, partID, partNumber, qnty } = req.body;

    if (!qnty || typeof qnty !== "number") {
      return utils.commonResponse(
        res,
        400,
        "Quantity (qnty) is required and must be a number"
      );
    }

    // Generate serial numbers based on quantity
    const serialNumbers = Array.from({ length: qnty }, () =>
      shortid.generate(6)
    );

    let hubIDasObject = new mongoose.Types.ObjectId(hubID)

    // Determine search criteria based on availability of partID or partNumber
    const searchCriteria = partID ? { partId: partID } : { partNumber: partNumber };

    // Find the partSerialNo document based on search criteria
    const partSerialRecord = await partSerialNo.findOne(searchCriteria);

    if (partSerialRecord) {
      // Check if hubSerialNo array contains the specified hubID
      const hubEntry = partSerialRecord.hubSerialNo.find(
        (entry) => entry.hubId === hubIDasObject
      );

      if (hubEntry) {
        // Update existing hubSerialNo entry

        console.log(hubIDasObject,partID,)
        await partSerialNo.updateOne(
          {
            ...searchCriteria,
            "hubSerialNo.hubId": hubIDasObject,
          },
          {
            $inc: { "hubSerialNo.$.serialNo": qnty },
            $push: { "hubSerialNo.$.serialNos": { $each: serialNumbers } },
          }
        );
      } else {
        // Add a new hubSerialNo entry if hubID doesn't exist
        await partSerialNo.updateOne(
          searchCriteria,
          {
            $push: {
              hubSerialNo: {
                hubId: hubIDasObject,
                serialNo: qnty,
                serialNos: serialNumbers,
              },
              partID:partID,
            },
          }
        );
      }
    } else {
      // If no document exists, create a new one with upsert
      await partSerialNo.updateOne(
        searchCriteria,
        {
          $setOnInsert: searchCriteria,
          $push: {
            hubSerialNo: {
              hubId: hubIDasObject,
              serialNo: qnty,
              serialNos: serialNumbers,
            },
            partID:partID,
          },
        },
        { upsert: true }
      );
    }

    // Fetch part details for response
    const part = partID
      ? await parts.findById(partID)
      : await parts.findOne({ partNumber: partNumber });

    return utils.commonResponse(res, 200, "Part serial number generated", {
      hubID: hubIDasObject,
      partID: part ? part._id : null,
      partNumber: part ? part.partNumber : partNumber,
      partDescription: part
        ? `${part.partNumber} - ${part.partDescription}`
        : "",
      qnty: qnty,
      serialNos: serialNumbers,
    });
  } catch (error) {
    console.error("Error generating part serial number:", error);
    return utils.commonResponse(res, 500, "Internal Server Error", error);
  }
};

exports.generatePanelSerialNo = async (req, res) => {
  try {
    const { hubID, panelID, qnty } = req.body;

    const arr1 = new Array(qnty).fill(0).map((x) => shortid.generate(6));

    panelSerialNo
      .findOneAndUpdate(
        {
          panelID: panelID,
          hubSerialNo: {
            $elemMatch: {
              hubID: hubID,
            },
          },
        },
        {
          $inc: { "hubSerialNo.$.serialNo": qnty },
          $push: { "hubSerialNo.$.serialNos": { $each: arr1 } },
        },
        { returnNewDocument: true }
      )
      .then(async (panelSerial) => {
        if (!panelSerial) {
          await panelSerialNo.findOneAndUpdate(
            { panelID: panelID },
            {
              $push: {
                hubSerialNo: { hubID: hubID, serialNo: qnty, serialNos: arr1 },
              },
            }
          );
        }

        panel = await Panels.findById(panelID);
        utils.commonResponse(res, 200, "Panel serial number generated", {
          hubID: hubID,
          panelID: panelID,
          serialNos: arr1,
        });
      });
  } catch (error) {
    utils.commonResponse(res, 500, "Unexpected server error", error.toString());
  }
};
