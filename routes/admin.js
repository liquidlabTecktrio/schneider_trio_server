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
const fs = require("fs");
const path = require("path");

// Set up the file storage configuration using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

if (fs.existsSync('uploads')) {
  const files = fs.readdirSync("uploads");
  files.forEach((file) => {
    const currentPath = path.join("uploads", file);
    fs.unlinkSync(currentPath);
  });
}
if (!fs.existsSync('uploads')) {
  fs.mkdirSync("uploads")
}

// Create a multer instance with storage configuration
const upload = multer({ storage: storage });

// ADMIN ROUTES
router.post("/adminLogin", adminController.adminLogin);
// router.post("/createComponent", componentController.createComponent);

// MANAGE HUBS
router.post("/createHub", hubController.createHubs);
router.post("/deleteHub", hubController.deleteHub);
router.get("/getAllHubs", hubController.getAllHubs);

// MANAGE SPOKES
router.post("/createSpoke", spokeController.createSpoke);
router.post("/deleteSpoke", spokeController.deleteSpoke);
router.get("/getAllSpokes", spokeController.getAllSpokes);

// router.get("/getAllComponents", componentController.getAllComponents);
// router.get("/getAllCommertialReferences", componentController.getAllCommertialReferences);

// MANAGE PARTS
router.post("/createPart", sheetController.createPart);
router.get("/getAllParts", componentController.getAllParts);

// SWITCHBOARD
// router.post("/createPanel", panelController.createPanel);
// router.get("/getAllPanels", panelController.getAllPanels);
// router.post("/createPanelType", panelController.createPanelType);
// router.post("/addBOMToPanelTypes", panelController.addBOMToPanelTypes);
// router.get("/getAllPanelTypes", panelController.getAllPanelTypes);

// router.post("/uploadSheet", sheetController.createPOFromGoogleSheet);
// router.post("/uploadSheetNew", sheetController.createPOFromGoogleSheetNew);

// PRINTER CONTROLS
router.get("/GETPrinter", printerController.GETPrinter);
router.post("/updatePrinter", printerController.updatePrinter);
router.post("/createPrinter", printerController.createPrinter);

// BOM CONTROLS
router.post("/uploadCR", sheetController.uploadBomGoogleSheet);
router.post("/uploadCRFromAdmin", upload.single("file"), sheetController.uploadCRFromAdmin);

// MANAGE CR
router.post("/createCR", sheetController.createCR);
router.post("/deleteCR", sheetController.deleteCR);
router.post("/recoverCR", sheetController.recoverCR);


module.exports = router;
