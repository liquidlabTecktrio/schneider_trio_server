const express = require("express");
const router = express.Router();
const serialNoController = require("../controllers/serial");
const BoxSerialNoController = require("../controllers/box");
const ProjectController = require("../controllers/projects");
const ComponentController = require("../controllers/components");
const sheetController = require("../controllers/sheetUpload");
// const printLabel = require('../controllers/printLabel')
const hubs = require("../controllers/hubs");
const fs = require("fs");
const path = require("path");

// router.post("/printlabel", printLabel.printLabelUsingIP);

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
router.post("/hubregister", hubs.createHubs);
router.post("/hublogin", hubs.LoginToHubs);
router.post(
  "/generateComponentSerialNo",
  serialNoController.generateComponentSerialNo
);

// ORDER RELATED REQUESTS
router.post("/uploadCRExcelFromHub", upload.single("file"), sheetController.uploadCRExcelFromHub);
router.post("/createNewOrderFromHub", ProjectController.createNewOrderFromHub);

// SERIAL NUMBER REQUESTS
router.post("/generatePartSerialNo", serialNoController.generatePartSerialNo);
router.post("/generatePanelSerialNo", serialNoController.generatePanelSerialNo);
router.post("/generateBoxSerialNo", BoxSerialNoController.generateBoxSerialNo);

// BOX RELATED REQUESTS
router.post("/addBoxToProject", BoxSerialNoController.addBoxToProject);
router.post("/removeBoxFromProject", BoxSerialNoController.removeBoxFromProject);
router.post("/addComponentsToBoxes", BoxSerialNoController.addComponentsToBox);
router.post("/getBoxDetails", BoxSerialNoController.getBoxDetails);
router.post("/shipProject", ProjectController.shipProject);
router.post("/updateBoxStatus", BoxSerialNoController.updateBoxStatus);
router.post("/getAllPartsInAllBoxes", BoxSerialNoController.getAllPartsInAllBoxes); router.post("/getBoxDetailsBasedOnComponentScan", ComponentController.getBoxDetailsBasedOnComponentScan);
router.post("/addPartsToBoxes", BoxSerialNoController.addPartsToBox);


// PROJECT RELATED REQEUSTS
router.post("/getAllProjects", ProjectController.getAllProjects);
router.post("/getOpenProjects", ProjectController.getOpenProjects);
router.post("/getProjectDetailsWithParts", ProjectController.getProjectDetailsWithParts);
router.post("/getProjectsDetails", ProjectController.getProjectsDetails);
router.post("/getAllPartsInProject", ProjectController.getAllPartsInProject);

// PARTS RELATED REQUESTS
router.post("/componentScanResult", ProjectController.getComponentScanResult);
router.post("/incrementFixedQuantity", ProjectController.getincrementFixedQuantity);

// SPOKE RELATED REQUESTS
router.post("/getAllSpokeProjects", ProjectController.getAllSpokeProjects);
router.post("/getSpokeProjectsDetails", ProjectController.getSpokeProjectsDetails);



module.exports = router;
