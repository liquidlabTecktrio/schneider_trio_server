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
const XLSX = require('xlsx');
const CommercialReference = require("../Models/CommercialReference");
const Products = require("../Models/Products");
const Parts = require("../Models/Parts");
const mongoose = require("mongoose");
const promise = require("bluebird/js/release/promise");


async function getUniqueParts(partsList) {
  const partMap = new Map();
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
  return partMap;
}

async function updatePartsIDs(newItems, partNumber) {
  try {
    const part = await Parts.findOne({ partNumber: partNumber });
    if (part) {
      const existingItems = new Set(
        part.parentIds.map((item) => `${item.productNumber}_${item.crNumber}`)
      );
      const itemsToAdd = newItems.filter(
        (item) => !existingItems.has(`${item.productNumber}_${item.crNumber}`)
      );
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
      }
    }
  } catch (error) {
    console.log("error: ", error);
  }
}

exports.createPOFromGoogleSheet = async (req, res) => {
  // THIS FUNCTION WILL CREATE ORDER / PROJECT FROM THE GOOGLE SHEET
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
    // //console.log(rows.toObject())
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
    // //console.log(data[0])
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
    // //console.log("project: ", project);

    // //console.log("project: ", project);
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
    //console.log(error);
    utils.commonResponse(res, 500, "server error", error.toString());
  }
};

exports.createCR = async (req, res) => {
  // THIS FUNCTION WILL HELP TO CREATE CR WITH PARTS 
  let newCR = {
    referenceNumber: req.body.referenceNumber,
    description: req.body.description,
    productNumber: req.body.productNumber,
    partNumbers: req.body.partNumbers
  }
  let part_array = []
  const ExistingCR = await CommercialReference.findOne({ 'referenceNumber': newCR.referenceNumber })
  if (ExistingCR) ExistingCR.isActive = false;
    for (const partNumber of newCR.partNumbers) {
      const existingPart = await Parts.findOne({ partNumber });
      if (!existingPart) {
        return utils.commonResponse(res, 404, "Part does not exist, add part first");
      }
      part_array.push(existingPart)
      const alreadyLinked = existingPart.parentIds.some(
        (parent) => parent.crNumber === newCR.referenceNumber
      );
      if (!alreadyLinked) {
        existingPart.parentIds.push({
          productNumber: "",
          crNumber: newCR.referenceNumber,
        });
        await existingPart.save();
      } 
    }
    CommercialReference.create({
      referenceNumber: newCR.referenceNumber,
      description: newCR.description,
      productId: newCR.productNumber,
      parts: part_array,
      quantity: 0
    }
    ).then((data) => {
      return utils.commonResponse(res, 200, "success")
    })
  }

exports.deleteCR= async (req, res) => {
  // THIS FUNCTION WILL DELETE CR FROM 
  let {referenceNumber} = req.body
  const CR = await CommercialReference.findOne({ 'referenceNumber': referenceNumber})
  if (!CR) return utils.commonResponse(res, 409, "ReferenceNumber do not exist")
  if (CR) {
    await CommercialReference.updateMany({ 'referenceNumber': referenceNumber},{
      isActive:false
    }
    ).then((data) => {
      return utils.commonResponse(res, 200, "success")
    })
  }
}

exports.recoverCR = async (req, res) => {
  // THIS FUCNTION WILL HELP TO CHANGE THE STATUS OF CR FROM ISACTIVE FALSE TO TRUE, 
  let {_id} = req.body
  const CR = await CommercialReference.findOne({_id:new mongoose.Types.ObjectId(_id)})
  if (!CR) return utils.commonResponse(res, 409, "ReferenceNumber do not exist")
  if (CR) {
    await CommercialReference.updateOne({_id:new mongoose.Types.ObjectId(_id)},{
      isActive:true
    }
    ).then((data) => {
      return utils.commonResponse(res, 200, "success", {})
    })
  }
}

exports.createPart = (async (req, res) => {
  // THIS FUNCTION WILL CREATE NEW PART IN THE SYSTEM
  let newPart = {
    partNumber: req.body.partNumber,
    partDescription: req.body.partDescription,
    quantity: req.body.quantity,
    grouped:req.body.grouped,
    PiecePerPacket:req.body.PiecePerPacket
  }
  const ExistingPart = await Parts.findOne({ partNumber: newPart.partNumber });
  if (ExistingPart) {
    return utils.commonResponse(res, 409, "PartNumber Exist", ExistingPart)
  }
  else {
    Parts.create(newPart).then((data) => {
      return utils.commonResponse(res, 200, "success", {})
    })
  }
})

// NOT IN USE
exports.uploadBomGoogleSheet = async (req, res) => {
  // THIS FUNCITON WILL CREATE BOM REFFERCE BASED ON THE CR LIST FROM GOOGLE EXCEL
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
    var newCommReff = [];
    if (newCRNos.length > 0) {
      newCommReff = JSON.parse(
        JSON.stringify(await CommercialReference.create(newCRNos))
      );
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
      //   //console.log("parts: ", parts);
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
    //console.log(error);
    utils.commonResponse(res, 500, "server error", error.toString());
  }
};

exports.uploadCRFromAdmin = async (req, res) => {
  // THIS FUNCTION WILL HELP TO CREATE NEW BOM RECORDS FROM THE BOM FILE THAT IS UPLOADING FROM THE ADMIN SIDE
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);
    let newCRs = [];
    let newCR
    let NeedSkip
    // Process rows
    await Bluebird.each(rows, async (_rowData) => {
      if (_rowData.Level === "0") {
        const cr = {
          referenceNumber: _rowData.Number,
          description: _rowData.EnglishDescription,
          quantity: 0,
          parts: [],
        };
        const ExistingCRList = await CommercialReference.findOne({ referenceNumber: cr.referenceNumber });
        if (!ExistingCRList) {
          // Create a new CR and cache it in the map
          newCR = await CommercialReference.create(cr);
          NeedSkip = false
          newCRs.push(newCR.referenceNumber);
        }
        else {
          // NeedSkip = true
          ExistingCRList.isActive = false
          ExistingCRList.save()
        }
      } else if (Number(_rowData.Level) >= 1 && !NeedSkip) {
        const part = {
          partNumber: _rowData.Number,
          partDescription: _rowData.EnglishDescription,
          quantity: Number(_rowData.Quantity),
          grouped:_rowData.grouped,
          PiecePerPacket:_rowData.PiecePerPacket
        };
        // creating part in parts and adding CR in the parent 
        const existingPart = await Parts.findOne({ partNumber:_rowData.Number });
        let currentpart 
        if (!existingPart) {
          // if do not exist create a new part
          let newpart = await Parts.create(part)
          currentpart = newpart
        }
        else{
          currentpart = existingPart
        }
        // Check if the CR number is already in the part's parentIds
        const alreadyLinked = currentpart.parentIds.some(
          (parent) => parent.crNumber === newCR.referenceNumber
        );
        if (!alreadyLinked) {
          currentpart.parentIds.push({
            productNumber: "",
            crNumber: newCR.referenceNumber,
          });
          await currentpart.save();
        } 
        newCR.parts.push(part);
        await newCR.save(); // Save after adding parts
      }
    });
    return utils.commonResponse(res, 200, "Upload successful", {
      "created new parts": newCRs,
    });
  } catch (error) {
    console.error("Error in uploadCRFromAdmin:", error);
    return utils.commonResponse(res, 500, "Server error", error.toString());
  }
};

exports.uploadCRExcelFromHub = async (req, res) => {
  // THIS FUNCTION WILL GENERATE A ORDER PREVIEW FOR THE UPDLOADED ORDER EXCEL SHEET FROM HUB
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // Reading and processing the Excel file
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet);
    // Initializing variables
    const CrsListFromExcel = rows
      .filter(row => row.Reference) // Filter rows with a valid reference
      .map(row => ({
        SwitchBoard: row.SwitchBoard,
        Reference: row.Reference,
        Enclosure: row.Enclosure,
        referenceNumber: row.Reference,
        compShortName: row.Reference,
        compPartNo: row.Reference,
        description: row.Description,
        fixedQuantity: row.FixedQuantity,
        Quantity: row.Quantity,
        isCritical: row["Core / Non core"] !== "Non-Core"
      }));
    // Extract unique switchboards with "Common Total" enclosures
    const switchBoards = [...new Set(CrsListFromExcel
      .filter(cr => cr.Enclosure === "Common Total")
      .map(cr => cr.SwitchBoard))];

    // Group CRs by switchboard
    const SwitchboardListWithCrs = switchBoards.map(switchBoard => ({
      switchBoard,
      components: CrsListFromExcel.filter(cr => cr.SwitchBoard === switchBoard && cr.Reference)
    }));

    // Fetch all commercial references from the database
    const EntireCommerialRef = await CommercialReference.find();
    const CRsinCurrentOrder = CrsListFromExcel.map(cr => cr.Reference);

    // Map order CRs to their parts
    const CRsWithParts = CRsinCurrentOrder.flatMap(currentRef =>
      EntireCommerialRef.filter(entireCR => entireCR.referenceNumber === currentRef)
    );

    // for( let cr of CRsWithParts){
    //   console.log(cr.parts)
    // }

    // Map switchboards to CRs with parts
    const SwitchBoardWithCRWithParts = SwitchboardListWithCrs.map(switchboard => ({
      ...switchboard,
      components: switchboard.components.map(cr => ({
        ...cr,
        parts: CRsWithParts.find(innerCR => innerCR.referenceNumber === cr.Reference)?.parts || []
      }))
    }));

    // Generate a final list of parts with aggregated quantities
    const EntirePartList = CRsWithParts.flatMap(cr => cr.parts || []);
    const FinalPartList = EntirePartList.reduce((acc, part) => {
      const existingPart = acc.find(item => item.partNumber === part.partNumber);
      if (existingPart) {
        existingPart.quantity += part.quantity;
      } else {
        acc.push({ partNumber: part.partNumber, quantity: part.quantity });
      }
      return acc;
    }, []);
    // Project details (static for now, can be dynamic)
    const ProjectDetails = {
      project_name: "Project 1",
      project_description: "This is a test data"
    };
    // Sending the response
    utils.commonResponse(res, 200, "success", {
      Switchboards: SwitchBoardWithCRWithParts,
      PartList: FinalPartList,
      ProjectDetails
    });
  } catch (error) {
    console.error(error);
    utils.commonResponse(res, 500, "server error", error.toString());
  }
}

// NOT IN USE
exports.createPOFromGoogleSheetNew = async (req, res) => {
  try {
    const serviceAccountAuth = new JWT({
      email: service_account.client_email,
      key: service_account.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheet = new GoogleSpreadsheet(req.body.sheetId, serviceAccountAuth);
    const sheetIndex = req.body.sheetIndex;
    const sheetinfo = await sheet.loadInfo();
    const worksheet = sheet.sheetsByIndex[sheetIndex];
    const rows = await worksheet.getRows();
    // //console.log(rows.toObject())
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
    // //console.log(data[0])
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
    const BOMPerSB = sheet.sheetsByIndex[sheetIndex];
    const BOMPerSB_Rows = await BOMPerSB.getRows({ options: { offset: 1 } });
    BOM_data = [];
    await Bluebird.each(BOMPerSB_Rows, async (rowData, _rowIndex) => {
      _rowData = rowData.toObject();

      BOM_data.push(_rowData);
    });

    // //console.log(BOM_data)

    // Get Switch board label
    switch_board = collect(
      BOM_data.filter((BOM_row) => {
        return BOM_row.Enclosure == "Common Total";
      })
    ).pluck("SwitchBoard").items;



    //console.log(switch_board)
    switchborad_data = [];
    switch_board.forEach((sb) => {
      // creating a unit/switchboard
      sb_data = {
        switchBoard: sb,
        components: [],
      };
      // Add Components to 
      BOM_data.forEach((element) => {
        if (element.SwitchBoard == sb) {
          //console.log(element.Reference)
          if (element.Reference != "") {
            sb_data.components.push(element);
          }
        }
      });
      switchborad_data.push(sb_data);
    });

    const project = await Projects.findOne({ ProjectID: req.body.projectId });
    // //console.log("project: ", project);

    //console.log("sb_date: ", switchborad_data);
    if (!project) {
      await Projects.create({
        ProjectName: shortid.generate(10),
        ProjectID: req.body.projectId,
        createdBy: req.body.spokeId,
        createdTo: req.body.hubId,
        status: "open",
        switchBoardData: switchborad_data,
      });
    } else {
      return utils.commonResponse(res, 200, "Project ID already exist", {});
    }

    utils.commonResponse(res, 200, "success", {});
  } catch (error) {
    //console.log(error);
    utils.commonResponse(res, 500, "server error", error.toString());
  }
};
