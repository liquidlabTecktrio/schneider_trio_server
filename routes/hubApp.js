const express = require("express");
const router = express.Router();
const serialNoController = require("../controllers/serial");
const BoxSerialNoController = require("../controllers/box");
const ProjectController = require("../controllers/projects");

router.post(
  "/generateComponentSerialNo",
  serialNoController.generateComponentSerialNo
);
router.post("/generatePanelSerialNo", serialNoController.generatePanelSerialNo);
router.post("/generateBoxSerialNo", BoxSerialNoController.generateBoxSerialNo);

router.post("/addBoxToProject", BoxSerialNoController.addBoxToProject);
router.post(
  "/addComponentsToBoxes",
  BoxSerialNoController.addComponentsToBox
);
//project
router.get("/getAllProjects", ProjectController.getAllProjects);
router.post("/getAllProjects", ProjectController.getAllProjects);
router.post("/getProjectsDetails", ProjectController.getProjectsDetails);

//spoke

router.post("/getAllSpokeProjects", ProjectController.getAllSpokeProjects);


// Boxes

router.post("/getBoxDetails", BoxSerialNoController.getBoxDetails);

module.exports = router;
