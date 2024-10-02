const express = require("express");
const router = express.Router();
const serialNoController = require("../controllers/serial")
const BoxSerialNoController = require("../controllers/box")




router.post("/generateComponentSerialNo",serialNoController.generateComponentSerialNo) 
router.post("/generatePanelSerialNo",serialNoController.generatePanelSerialNo) 
router.post("/generateBoxSerialNo",BoxSerialNoController.generateBoxSerialNo) 

module.exports = router;