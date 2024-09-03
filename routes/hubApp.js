const express = require("express");
const router = express.Router();
const serialNoController = require("../controllers/serial")




router.post("/generateComponentSerialNo",serialNoController.generateComponentSerialNo) 
router.post("/generatePanelSerialNo",serialNoController.generatePanelSerialNo) 

module.exports = router;