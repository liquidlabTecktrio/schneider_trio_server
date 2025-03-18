const express = require("express");
const router = express.Router();
const serialNoController = require("../controllers/serial");
const BoxSerialNoController = require("../controllers/box");
const ProjectController = require("../controllers/projects");
const PartsController = require("../controllers/parts");
const sheetController = require("../controllers/sheetUpload");
const SpokeController = require("../controllers/spoke");

// const printLabel = require('../controllers/printLabel')
const hubs = require("../controllers/hubs");
const fs = require("fs");
const path = require("path");
// router.post("/printlabel", printLabel.printLabelUsingIP);

const multer = require('multer');
const verifyToken = require("../Middleware");

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

if (fs.existsSync('uploads')) {
  const files = fs.readdirSync("uploads");
  files.forEach((file) => {
    const currentPath = path.join("uploads", file);
    fs.unlinkSync(currentPath);  // Use unlinkSync to remove the file
  });
}
if (!fs.existsSync('uploads')) {
  fs.mkdirSync("uploads")
}

// Create a multer instance with storage configuration
const upload = multer({ storage: storage });

// AUTHENTICATION 
router.post("/hublogin", hubs.LoginToHubs);
router.post("/createhubuser",verifyToken, hubs.createHubUser);
router.post("/getallhubusers",verifyToken, hubs.getAllHubUser);
router.post("/activatehubhuser",verifyToken, hubs.activateHubUser);
router.post("/deactivatehubhuser",verifyToken, hubs.deactivateHubUser);
router.post("/deletehubuser",verifyToken, hubs.deletehubuser);
router.post("/updatehubuser",verifyToken, hubs.updatehubuser);
router.post(
  "/generateComponentSerialNo",verifyToken,
  serialNoController.generateComponentSerialNo
);


// ORDER RELATED REQUESTS
router.post("/uploadCRExcelFromHub",verifyToken, upload.single("file"), sheetController.uploadCRExcelFromHub);
router.post("/createNewOrderFromHub",verifyToken, ProjectController.createNewOrderFromHub);

// SERIAL NUMBER REQUESTS
router.post("/generatePartSerialNo",verifyToken, serialNoController.generatePartSerialNo);
router.post("/generatePanelSerialNo",verifyToken, serialNoController.generatePanelSerialNo);
router.post("/generateBoxSerialNo",verifyToken, BoxSerialNoController.generateBoxSerialNo);

// BOX RELATED REQUESTS
router.post("/addBoxToProject",verifyToken, BoxSerialNoController.addBoxToProject);
router.post("/removeBoxFromProject",verifyToken, BoxSerialNoController.removeBoxFromProject);
router.post("/addComponentsToBoxes",verifyToken, BoxSerialNoController.addComponentsToBox);
router.post("/getBoxDetails",verifyToken, BoxSerialNoController.getBoxDetails);
router.post("/shipProject",verifyToken, ProjectController.shipProject);
router.post("/updateBoxStatus",verifyToken, BoxSerialNoController.updateBoxStatus);
router.post("/getAllPartsInAllBoxes",verifyToken, BoxSerialNoController.getAllPartsInAllBoxes);       
router.post("/getBoxDetailsBasedOnComponentScan", PartsController.getBoxDetailsBasedOnComponentScan);
router.post("/addPartsToBoxes",verifyToken, BoxSerialNoController.addPartsToBox);
router.post("/removePartsFromBoxes",verifyToken, BoxSerialNoController.removePartsFromBoxes);


// PROJECT RELATED REQEUSTS
router.post("/getAllProjectsInHub",verifyToken, ProjectController.getAllProjectsInHub);
router.post("/getOpenProjects",verifyToken, ProjectController.getOpenProjects);
router.post("/getProjectDetailsWithParts",verifyToken, ProjectController.getProjectDetailsWithParts);
router.post("/getProjectsDetails",verifyToken, ProjectController.getProjectsDetails);
router.post("/getShippedDetails",verifyToken, ProjectController.getShippedDetails);
router.post("/getPendingPartsDetails",verifyToken, ProjectController.getPendingPartsDetails);
router.post("/getAllPartsInProject",verifyToken, ProjectController.getAllPartsInProject);

// PARTS RELATED REQUESTS
router.post("/componentScanResult",verifyToken, ProjectController.getComponentScanResult);
router.post("/incrementFixedQuantity",verifyToken, ProjectController.getincrementFixedQuantity);
router.post("/partScanResult",verifyToken, PartsController.partScanResult);

// SPOKE RELATED REQUESTS
router.post("/getSpokeDetails", verifyToken, SpokeController.getSpokeDetails);

module.exports = router;
