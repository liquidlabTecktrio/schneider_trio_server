const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");
const componentController = require("../controllers/components");
const hubController = require("../controllers/hubs");
const spokeController = require("../controllers/spoke");
const panelController = require("../controllers/panels");
const sheetController = require("../controllers/sheetUpload");

router.post("/adminLogin", adminController.adminLogin);
router.post("/createComponent", componentController.createComponent);
router.post("/createHub", hubController.createHubs);
router.get("/getAllHubs", hubController.getAllHubs);
router.post("/createSpoke", spokeController.createSpoke);
router.get("/getAllHubs", spokeController.getAllSpokes);
router.get("/getAllSpokes", spokeController.getAllSpokes);
router.get("/getAllComponents", componentController.getAllComponents);
router.get("/getAllParts", componentController.getAllParts);
router.post("/createPanel", panelController.createPanel);
router.get("/getAllPanels", panelController.getAllPanels);
router.post("/createPanelType", panelController.createPanelType);
router.post("/addBOMToPanelTypes", panelController.addBOMToPanelTypes);
router.get("/getAllPanelTypes", panelController.getAllPanelTypes);
router.post("/uploadSheet", sheetController.createPOFromGoogleSheet);
router.post("/uploadSheetNew", sheetController.createPOFromGoogleSheetNew);

router.post("/uploadCR", sheetController.uploadBomGoogleSheet);
// router.post("/updatePartsIDs", sheetController.updatePartsIDs);

module.exports = router;
