const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware"); // Middleware for token verification
const ProjectController = require("../controllers/projects");
const SpokeController = require("../controllers/spoke");

// Authentication
router.post("/spokelogin", SpokeController.LoginToSpoke);

// SPOKE RELATED REQUESTS
router.post("/getAllSpokeProjects", verifyToken, ProjectController.getAllSpokeProjects);
router.post("/getSpokeProjectsDetails", verifyToken, ProjectController.getSpokeProjectsDetails);

module.exports = router;
