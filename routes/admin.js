const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");
const componentController = require("../controllers/components");
const hubController = require("../controllers/hubs");
const spokeController = require("../controllers/spoke");
const panelController = require("../controllers/panels");
const sheetController = require("../controllers/sheetUpload");
const printerController = require("../controllers/printerController");

const multer = require('multer');

// Set up the file storage configuration using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Where to store the file
    cb(null, 'uploads/');  // Specify the folder where you want to store the uploaded files
  },
  filename: (req, file, cb) => {
    // Specify a unique filename for the uploaded file
    cb(null, Date.now() + file.originalname);  // Use timestamp to create a unique filename
  }
});

const fs = require("fs");
const path = require("path");
if(fs.existsSync('uploads'))
{
  const files = fs.readdirSync("uploads");
  files.forEach((file) => {
    const currentPath = path.join("uploads", file);
      fs.unlinkSync(currentPath);  // Use unlinkSync to remove the file
  });
}
if (!fs.existsSync('uploads')){
  fs.mkdirSync("uploads")
}

// Create a multer instance with storage configuration
const upload = multer({ storage: storage });


router.post("/adminLogin", adminController.adminLogin);
router.post("/createComponent", componentController.createComponent);
router.post("/createHub", hubController.createHubs);
router.post("/deleteHub", hubController.deleteHub);
router.get("/getAllHubs", hubController.getAllHubs);
router.post("/createSpoke", spokeController.createSpoke);
router.post("/deleteSpoke", spokeController.deleteSpoke);
router.get("/getAllHubs", spokeController.getAllSpokes);
router.get("/getAllSpokes", spokeController.getAllSpokes);
router.get("/getAllComponents", componentController.getAllComponents);
router.get("/getAllCommertialReferences", componentController.getAllCommertialReferences);
router.get("/getAllParts", componentController.getAllParts);
router.post("/createPanel", panelController.createPanel);
router.get("/getAllPanels", panelController.getAllPanels);
router.post("/createPanelType", panelController.createPanelType);
router.post("/addBOMToPanelTypes", panelController.addBOMToPanelTypes);
router.get("/getAllPanelTypes", panelController.getAllPanelTypes);
router.post("/uploadSheet", sheetController.createPOFromGoogleSheet);
router.post("/uploadSheetNew", sheetController.createPOFromGoogleSheetNew);


router.post("/GETPrinterIp", printerController.GETPrinterIp);
router.post("/updatePrinter", printerController.updatePrinter);
router.post("/createPrinter", printerController.createPrinter);


router.post("/uploadCR", sheetController.uploadBomGoogleSheet);
router.post("/uploadCRFromAdmin", upload.single("file"), sheetController.uploadCRFromAdmin);


router.post("/createCR", sheetController.createCR);
router.post("/createPart", sheetController.createPart);


// router.post("/updatePartsIDs", sheetController.updatePartsIDs);

module.exports = router;
