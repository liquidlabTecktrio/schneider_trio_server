const { default: mongoose } = require("mongoose")
const Printer = require("../Models/Printer")

const utils = require("../controllers/utils");

exports.createPrinter = async (req, res) => {
    let data = req.body
    // //console.log('cr list', data.switchBoards)
    let printerIP = data.printerIP
    let printerName = data.printerName

    console.log(printerIP, printerName)

    let printerData = {
      printerIP:printerIP,
      printerName:printerName
    }
    await Printer.create(printerData)
    utils.commonResponse(res, 200, "success", {});

}  

exports.updatePrinter = async (req, res) => {
  let data = req.body;
  console.log(data);

  try{
  // Destructure relevant fields
  let { printerIP, printerName } = data;
  
  
  // Find the printer by ID
  let currentPrinter = await Printer.find();
  currentPrinter = currentPrinter[0]
  // Check if printer was found
  if (!currentPrinter) {
    return utils.commonResponse(res, 404, "Printer not found", {});
  }

  // Update printer properties
  currentPrinter.printerIP = printerIP;
  currentPrinter.PrinterName = printerName;

  // Save the updated printer data to the database
  await currentPrinter.save();

  // Send the success response
  utils.commonResponse(res, 200, "Success", currentPrinter);
}
 catch (error) 
 {
  console.error(error);
  utils.commonResponse(res, 500, "Internal server error", {});
}
}

exports.GETPrinter = async (req, res) => {
    // let data = req.body
    // console.log(data)
    // idAsObject = new mongoose.Types.ObjectId(data.printerID)

    let currentPrinter = await Printer.find()
    // console.log('eee',currentPrinter)
    utils.commonResponse(res, 200, "success", currentPrinter[0]);

}  
