const express = require("express");
const router = express.Router();
const serialNoController = require("../controllers/serial")



router.post("/generateComponentSerialNo",serialNoController.generateComponentSerialNo) 

module.exports = router;