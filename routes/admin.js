const express = require("express");
const router = express.Router();


const adminController = require("../controllers/admin");
const componentController = require("../controllers/components")
const hubController = require("../controllers/hubs")
const spokeController = require("../controllers/spoke")


router.post("/adminLogin", adminController.adminLogin);
router.post("/createComponent",componentController.createComponent)
router.post("/createHub",hubController.createHubs)
router.get("/getAllHubs",hubController.getAllHubs)
router.post("/createSpoke",spokeController.createSpoke)
router.get("/getAllHubs",spokeController.getAllSpokes)
router.get("/getAllSpokes",spokeController.getAllSpokes)
router.get("/getAllComponents",componentController.getAllComponents)

module.exports = router;