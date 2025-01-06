
const ProjectController = require("../controllers/projects");
const spoke = require("../controllers/spoke")


// Authentication 
router.post("/spokelogin", spoke.LoginToSpoke);
// SPOKE RELATED REQUESTS
router.post("/getAllSpokeProjects",verifyToken, ProjectController.getAllSpokeProjects);
router.post("/getSpokeProjectsDetails",verifyToken, ProjectController.getSpokeProjectsDetails);

