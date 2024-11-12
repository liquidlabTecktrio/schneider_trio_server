const express = require("express");
const router = express.Router();
const serialNoController = require("../controllers/serial");
const BoxSerialNoController = require("../controllers/box");
const ProjectController = require("../controllers/projects");
const ComponentController = require("../controllers/components");

// generate
router.post(
  "/generateComponentSerialNo",
  serialNoController.generateComponentSerialNo
);
router.post(
  "/generatePartSerialNo",
  serialNoController.generatePartSerialNo
);
router.post("/generatePanelSerialNo", serialNoController.generatePanelSerialNo);
router.post("/generateBoxSerialNo", BoxSerialNoController.generateBoxSerialNo);

// add
router.post("/addBoxToProject", BoxSerialNoController.addBoxToProject);
router.post("/addComponentsToBoxes", BoxSerialNoController.addComponentsToBox);

//project
router.post("/getAllProjects", ProjectController.getAllProjects);
router.post(
  "/getProjectDetailsWithParts",
  ProjectController.getProjectDetailsWithParts
);

// router.post("/getAllProjects", ProjectController.getAllProjects);
router.post("/getProjectsDetails", ProjectController.getProjectsDetails);
router.post("/componentScanResult", ProjectController.getComponentScanResult);
router.post(
  "/incrementFixedQuantity",
  ProjectController.getincrementFixedQuantity
);

//spoke
router.post("/getAllSpokeProjects", ProjectController.getAllSpokeProjects);
router.post(
  "/getSpokeProjectsDetails",
  ProjectController.getSpokeProjectsDetails
);

// Boxes
router.post("/getBoxDetails", BoxSerialNoController.getBoxDetails);
router.post("/shipProject", ProjectController.shipProject);
router.post("/updateBoxStatus", BoxSerialNoController.updateBoxStatus);

//
router.post(
  "/getBoxDetailsBasedOnComponentScan",
  ComponentController.getBoxDetailsBasedOnComponentScan
);

module.exports = router;
