const { default: mongoose } = require("mongoose")
const Printer = require("../Models/Printer")

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
    let data = req.body
    // //console.log('cr list', data.switchBoards)
    let printerIP = data.printerIP
    let printerName = data.printerName
    idAsObject = new mongoose.Types.ObjectId(data.printerID)

    let currentPrinter = Printer.findOne({_id:idAsObject})
    let printerData = {
      printerIP:printerIP,
      printerName:printerName
    }
    await currentPrinter.updateOne({_id:idAsObject},{printerName,printerName})
    utils.commonResponse(res, 200, "success", {});

}  

exports.GETPrinterIp = async (req, res) => {
    let data = req.body
    idAsObject = new mongoose.Types.ObjectId(data.printerID)

    let currentPrinter = Printer.findOne({_id:idAsObject})
    utils.commonResponse(res, 200, "success", currentPrinter);

}  
