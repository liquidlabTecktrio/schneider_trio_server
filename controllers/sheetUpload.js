const Spoke = require("../Models/Spoke");
const utils = require("../controllers/utils");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const service_account = require("../linnk-366101-e44baeb100f9.json");
const { JWT } = require("google-auth-library");
const Bluebird = require("bluebird");
const Component = require("../Models/Components");
const collect = require("collect.js");
const Projects = require("../Models/Projects");
const shortid = require("shortid");
const ComponentSerialNo = require("../Models/componentSerialNo");
const PartsSerialNo = require("../Models/PartsSerialNo");

const CommercialReference = require("../Models/CommercialReference");
const Products = require("../Models/Products");
const Parts = require("../Models/Parts");
const mongoose = require("mongoose");
const promise = require("bluebird/js/release/promise");

exports.createPOFromGoogleSheet = async (req, res) => {
  try {
    const serviceAccountAuth = new JWT({
      email: service_account.client_email,
      key: service_account.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheet = new GoogleSpreadsheet(
      process.env.ALUMINIUMCONFIGSHEETID,
      serviceAccountAuth
    );
    const sheetinfo = await sheet.loadInfo();
    const worksheet = sheet.sheetsByIndex[1];
    const rows = await worksheet.getRows();
    // console.log(rows.toObject())
    // const _rowIndex = 1;
    data = [];
    await Bluebird.each(rows, async (rowData, _rowIndex) => {
      _rowData = rowData.toObject();
      if (_rowData.Reference != "") {
        data.push({
          componentName: _rowData.Reference,
          compShortName: _rowData.Reference,
          compPartNo: _rowData.Reference,
          compDescription: _rowData.Description,
          fixedQuantity: rowData.FixedQuantity,
          isCritical: _rowData["Core / Non core"] == "Non-Core" ? false : true,
        });
      }
    });
    // console.log(data[0])
    compPartNos = await Component.aggregate([
      {
        $project: {
          compPartNo: 1,
        },
      },
    ]);

    existingPartNos = collect(compPartNos).pluck("compPartNo");
    // existingPartIds = collect(compPartNos).pluck("_id")
    newPartNos = data
      .map((_data) => {
        if (!existingPartNos.items.includes(_data.compPartNo)) {
          return _data;
        }
      })
      .filter((notUndefined) => notUndefined !== undefined);
    // newPartSerialNo = data
    //   .map((_data) => {
    //     if (!existingPartIds.items.includes(_data._id)) {
    //       return {hubSerialNo:[],componentID:_data._id};
    //     }
    //   })
    //   .filter((notUndefined) => notUndefined !== undefined);

    if (newPartNos.length > 0) {
      newComponents = JSON.parse(
        JSON.stringify(await Component.create(newPartNos))
      );

      newComponentSerialNos = newComponents.map((newComponent) => {
        return {
          hubSerialNo: [],
          componentID: newComponent._id,
          componentName: newComponent.componentName,
        };
      });
      await ComponentSerialNo.create(newComponentSerialNos);
    }
    const BOMPerSB = sheet.sheetsByIndex[1];
    const BOMPerSB_Rows = await BOMPerSB.getRows({ options: { offset: 1 } });
    BOM_data = [];
    await Bluebird.each(BOMPerSB_Rows, async (rowData, _rowIndex) => {
      _rowData = rowData.toObject();

      BOM_data.push(_rowData);
    });

    switch_board = collect(
      BOM_data.filter((BOM_row) => {
        return BOM_row.Enclosure == "Common Total";
      })
    ).pluck("SwitchBoard").items;

    switchborad_data = [];
    switch_board.forEach((sb) => {
      sb_data = {
        switchBoard: sb,
        components: [],
      };
      BOM_data.forEach((element) => {
        if (element.SwitchBoard == sb) {
          if (element.Reference != "") {
            sb_data.components.push(element);
          }
        }
      });
      switchborad_data.push(sb_data);
    });

    const project = await Projects.findOne({ ProjectID: req.body.projectId });
    console.log("project: ", project);

    // console.log("project: ", project);
    if (!project) {
      await Projects.create({
        ProjectName: shortid.generate(10),
        ProjectID: req.body.projectId,
        createdBy: req.body.spokeId,
        createdTo: req.body.hubId,
        status: "ordered",
        switchBoardData: switchborad_data,
      });
    } else {
      return utils.commonResponse(res, 200, "Project ID already exist", {});
    }

    utils.commonResponse(res, 200, "success", {});
  } catch (error) {
    console.log(error);
    utils.commonResponse(res, 500, "server error", error.toString());
  }
};

// async function getUniqueParts(partsList) {
//   const partMap = new Map();
//   console.log(partsList.length);

//   partsList.forEach((val) => {
//     if (!partMap.has(val.partNumber)) {
//       // Add new entry in map with initialized parentIds
//       partMap.set(val.partNumber, {
//         ...val,
//         parentIds: [
//           {
//             productNumber: val.productNumber,
//             crNumber: val.crNumber,
//           },
//         ],
//       });
//     } else {
//       // Update existing part's parentIds if unique
//       const existingPart = partMap.get(val.partNumber);
//       const parentExists = existingPart.parentIds.some(
//         (parent) =>
//           parent.productNumber === val.productNumber &&
//           parent.crNumber === val.crNumber
//       );

//       if (!parentExists) {
//         existingPart.parentIds.push({
//           productNumber: val.productNumber,
//           crNumber: val.crNumber,
//         });
//       }
//     }
//   });

//   console.log("partMap: ", partMap);
//   return partMap;
// }

async function getUniqueParts(partsList) {
  const partMap = new Map();
  console.log(partsList.length);

  partsList.forEach((val) => {
    if (!partMap.has(val.partNumber)) {
      partMap.set(val.partNumber, {
        ...val,
        parentIds: val.parentIds || [
          {
            productNumber: val.productNumber,
            crNumber: val.crNumber,
          },
        ],
      });
    } else {
      // Update the existing part's parentIds if unique
      const existingPart = partMap.get(val.partNumber);
      const parentExists = existingPart.parentIds.some(
        (parent) =>
          parent.productNumber === val.productNumber &&
          parent.crNumber === val.crNumber
      );

      if (!parentExists) {
        existingPart.parentIds.push({
          productNumber: val.productNumber,
          crNumber: val.crNumber,
        });
      }
    }
  });

  console.log("partMap: ", partMap);
  return partMap;
}

async function updatePartsIDs(newItems, partNumber) {
  console.log("partNumber: ", partNumber);
  console.log("newItems: ", newItems);
  try {
    // Define the unique items to add
    // const newItems = [
    //   { productNumber: "NNZ97512", crNumber: "PFCP6H2WXD426" },
    //   { productNumber: "TEST6", crNumber: "PFCP6H2WXD426" },
    // ];

    // Find the document
    const part = await Parts.findOne({ partNumber: partNumber });
    if (part) {
      const existingItems = new Set(
        part.parentIds.map((item) => `${item.productNumber}_${item.crNumber}`)
      );
      console.log(" part.parentIds: ", part.parentIds);
      console.log("existingItems: ", existingItems);
      const itemsToAdd = newItems.filter(
        (item) => !existingItems.has(`${item.productNumber}_${item.crNumber}`)
      );
      console.log("itemsToAdd: ", itemsToAdd);

      // Only update if there are items to add
      if (itemsToAdd.length > 0) {
        const updateDoc = {
          $addToSet: {
            parentIds: { $each: itemsToAdd },
          },
        };

        const updatedData = await Parts.findOneAndUpdate(
          { partNumber: partNumber },
          updateDoc,
          { new: true }
        );
        console.log("updatedData: ", updatedData);
      }
    }
  } catch (error) {
    console.log("error: ", error);
  }
}
exports.uploadBomGoogleSheet = async (req, res) => {
  try {
    const serviceAccountAuth = new JWT({
      email: service_account.client_email,
      key: service_account.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheet = new GoogleSpreadsheet(
      process.env.COMMERCIALREFFERENCE,
      serviceAccountAuth
    );
    const sheetinfo = await sheet.loadInfo();
    const worksheet = sheet.sheetsByIndex[0];
    const rows = await worksheet.getRows();

    commercialReff = [];
    productsList = [];
    partsList = [];

    cr = {};
    product = {};
    part = {};

    parentIdsList = [];

    await Bluebird.each(rows, async (rowData, _rowIndex) => {
      _rowData = rowData.toObject();

      if (_rowData.Level == "0") {
        cr = {};
        cr.referenceNumber = _rowData.Number;
        cr.description = _rowData.EnglishDescription;

        cr.parts = [];
      }
      if (_rowData.Level == "1") {
        product = {};
        product.productNumber = _rowData.Number;
        product.productDescription = _rowData.EnglishDescription;
        product.crNumber = cr.referenceNumber;
        product.quantity = _rowData.Quantity;

        cr.productNumber = _rowData.Number;
        productsList.push(product);
      }
      if (_rowData.Level == "2") {
        part = {};

        part.partNumber = _rowData.Number;
        part.partDescription = _rowData.EnglishDescription;
        part.quantity = _rowData.Quantity;
        part.videoUrl = _rowData.videoUrl;
        part.isCritical = _rowData.Criticality == "MINOR" ? false : true;
        part.productNumber = _rowData.ParentNumber;
        part.crNumber = cr.referenceNumber;

        cr.parts.push(part);
        partsList.push(part);
      }

      if (
        !commercialReff.some((e) => e.referenceNumber == cr.referenceNumber)
      ) {
        commercialReff.push(cr);
      }
    });

    comReffNos = await CommercialReference.aggregate([
      {
        $project: {
          referenceNumber: 1,
        },
      },
    ]);

    existingCRNos = collect(comReffNos).pluck("referenceNumber");

    newCRNos = commercialReff
      .map((_data) => {
        if (!existingCRNos.items.includes(_data.referenceNumber)) {
          return _data;
        }
      })
      .filter((notUndefined) => notUndefined !== undefined);

    // console.log("newDATA: ", newDATA);
    var newCommReff = [];
    if (newCRNos.length > 0) {
      newCommReff = JSON.parse(
        JSON.stringify(await CommercialReference.create(newCRNos))
      );

      // console.log("newCommReff: ", newCommReff);
      const newProductList = productsList.map((product) => {
        const matchingItem = newCommReff.find(
          (item) => item.referenceNumber === product.crNumber
        );
        return {
          ...product,
          crId: matchingItem
            ? new mongoose.Types.ObjectId(matchingItem._id)
            : null,
        };
      });

      productsList = newProductList;
    }

    getProductNumber = await Products.aggregate([
      {
        $project: {
          productNumber: 1,
        },
      },
    ]);
    existingProductNos = collect(getProductNumber).pluck("productNumber");
    newProductsNos = productsList
      .map((_data) => {
        if (!existingProductNos.items.includes(_data.productNumber)) {
          return _data;
        }
      })
      .filter((notUndefined) => notUndefined !== undefined);
    var newProductListFromResponse;
    if (newProductsNos.length > 0) {
      newProductListFromResponse = JSON.parse(
        JSON.stringify(await Products.create(newProductsNos))
      );
    }

    // const partMap = new Map();
    // console.log(partsList.length);

    // partsList.forEach((val) => {
    //   if (!partMap.has(val.partNumber)) {
    //     // Add new entry in map with initialized parentIds
    //     partMap.set(val.partNumber, {
    //       ...val,
    //       parentIds: [
    //         {
    //           productNumber: val.parentNumber,
    //           crNumber: val.crNumber,
    //         },
    //       ],
    //     });
    //   } else {
    //     // Update existing part's parentIds if unique
    //     const existingPart = partMap.get(val.partNumber);
    //     const parentExists = existingPart.parentIds.some(
    //       (parent) =>
    //         parent.productNumber === val.parentNumber &&
    //         parent.crNumber === val.crNumber
    //     );

    //     if (!parentExists) {
    //       existingPart.parentIds.push({
    //         productNumber: val.parentNumber,
    //         crNumber: val.crNumber,
    //       });
    //     }
    //   }
    // });
    const uniqueParts = await getUniqueParts(partsList);

    const partsListnew = Array.from(uniqueParts.values());

    partsNumbersRes = await Parts.aggregate([
      {
        $project: {
          partNumber: 1,
        },
      },
    ]);

    existingPartNos = collect(partsNumbersRes).pluck("partNumber");
    alreadyCreatedParts = [];
    newPartsNos = partsListnew
      .map((_data) => {
        if (!existingPartNos.items.includes(_data.partNumber)) {
          return _data;
        } else {
          alreadyCreatedParts.push(_data);
        }
      })
      .filter((notUndefined) => notUndefined !== undefined);

    if (newPartsNos.length > 0) {
      // await Parts.create(partsListnew);
      _newParts = JSON.parse(JSON.stringify(await Parts.create(newPartsNos)));

      newPartsSerialNOs = _newParts.map((newComponent) => {
        return {
          hubSerialNo: [],
          partId: newComponent._id,
          partNumber: newComponent.partNumber,
        };
      });
      await PartsSerialNo.create(newPartsSerialNOs);
    }

    if (alreadyCreatedParts.length > 0) {
      uniqueAlreadyParts = await getUniqueParts(alreadyCreatedParts);
      uniqueAlreadyParts = Array.from(uniqueAlreadyParts.values());

      // uniqueAlreadyParts.forEach(async (parts) => {
      //   console.log("parts: ", parts);
      //   // const updateDoc = {
      //   //   $addToSet: {
      //   //     parentIds: {
      //   //       $each: parts.parentIds ?? [],
      //   //     },
      //   //   },
      //   // };
      //   // await Parts.findOneAndUpdate(
      //   //   { partNumber: parts.parentNumber },
      //   //   updateDoc,
      //   //   { new: true }
      //   // );
      //   await updatePartsIDs(parts.parentIds ?? [], parts.parentNumber);
      // });

      await Promise.all(
        uniqueAlreadyParts.map((parts) =>
          updatePartsIDs(parts.parentIds ?? [], parts.partNumber)
        )
      );
    }

    utils.commonResponse(res, 200, "success", {});

    // await Parts.insertMany(parts);
  } catch (error) {
    console.log(error);
    utils.commonResponse(res, 500, "server error", error.toString());
  }
};

async function getAvailableCommonReffData(crNumberList) {
  const crData = await CommercialReference.aggregate([
    {
      $match: {
        referenceNumber: { $in: crNumberList },
      },
    },
  ]);
  return crData;
}

exports.createPOFromGoogleSheetNew = async (req, res) => {
  try {
    const serviceAccountAuth = new JWT({
      email: service_account.client_email,
      key: service_account.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheet = new GoogleSpreadsheet(
      process.env.ALUMINIUMCONFIGSHEETID,
      serviceAccountAuth
    );
    const sheetinfo = await sheet.loadInfo();
    const worksheet = sheet.sheetsByIndex[0];
    const rows = await worksheet.getRows();
    // console.log(rows.toObject())
    // const _rowIndex = 1;
    data = [];
    await Bluebird.each(rows, async (rowData, _rowIndex) => {
      _rowData = rowData.toObject();
      if (
        _rowData.Reference != "" &&
        _rowData.Reference != null &&
        _rowData.Reference != undefined
      ) {
        data.push({
          componentName: _rowData.Reference,
          compShortName: _rowData.Reference,
          compPartNo: _rowData.Reference,
          compDescription: _rowData.Description,
          fixedQuantity: rowData.FixedQuantity,
          quantity: rowData.Quantity,
          isCritical: _rowData["Core / Non core"] == "Non-Core" ? false : true,
        });
      }
    });
    // console.log(data[0])
    comReffNos = await CommercialReference.aggregate([
      {
        $project: {
          referenceNumber: 1,
        },
      },
    ]);

    existingPartNos = collect(comReffNos).pluck("referenceNumber");

    newPartNos = data
      .map((_data) => {
        if (!existingPartNos.items.includes(_data.componentName)) {
          return _data;
        }
      })
      .filter((notUndefined) => notUndefined !== undefined);

    if (newPartNos.length > 0) {
      return utils.commonResponse(
        res,
        404,
        "There are some commorcial refference are yet to create",
        newPartNos.map((e) => e.componentName)
      );
    }

    // if (newPartNos.length > 0) {
    //   newComponents = JSON.parse(
    //     JSON.stringify(await Component.create(newPartNos))
    //   );

    //   newComponentSerialNos = newComponents.map((newComponent) => {
    //     return {
    //       hubSerialNo: [],
    //       componentID: newComponent._id,
    //       componentName: newComponent.componentName,
    //     };
    //   });
    //   await ComponentSerialNo.create(newComponentSerialNos);
    // }
    const BOMPerSB = sheet.sheetsByIndex[0];
    const BOMPerSB_Rows = await BOMPerSB.getRows({ options: { offset: 1 } });
    BOM_data = [];
    await Bluebird.each(BOMPerSB_Rows, async (rowData, _rowIndex) => {
      _rowData = rowData.toObject();

      BOM_data.push(_rowData);
    });

    switch_board = collect(
      BOM_data.filter((BOM_row) => {
        return BOM_row.Enclosure == "Common Total";
      })
    ).pluck("SwitchBoard").items;

    switchborad_data = [];
    switch_board.forEach((sb) => {
      sb_data = {
        switchBoard: sb,
        components: [],
      };
      BOM_data.forEach((element) => {
        if (element.SwitchBoard == sb) {
          if (element.Reference != "") {
            sb_data.components.push(element);
          }
        }
      });
      switchborad_data.push(sb_data);
    });

    const project = await Projects.findOne({ ProjectID: req.body.projectId });
    console.log("project: ", project);

    // console.log("project: ", project);
    if (!project) {
      await Projects.create({
        ProjectName: shortid.generate(10),
        ProjectID: req.body.projectId,
        createdBy: req.body.spokeId,
        createdTo: req.body.hubId,
        status: "ordered",
        switchBoardData: switchborad_data,
      });
    } else {
      return utils.commonResponse(res, 200, "Project ID already exist", {});
    }

    utils.commonResponse(res, 200, "success", {});
  } catch (error) {
    console.log(error);
    utils.commonResponse(res, 500, "server error", error.toString());
  }
};
