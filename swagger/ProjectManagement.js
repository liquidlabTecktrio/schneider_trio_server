/**
 * @swagger
 * /hub/shipProject:
 *   post:
 *     tags:
 *       - Project
 *     summary: Ship a project
 *     description: This endpoint updates the project status to "shipped" after verifying that all required components have been shipped.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b7"
 *                 description: The ID of the project to be shipped.
 *     responses:
 *       200:
 *         description: The project has been shipped successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "The project has been shipped successfully"
 *       201:
 *         description: Some components are missing, and the project cannot be shipped.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "The project cannot be shipped as the following items are not shipped"
 *                 missingComponents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reference:
 *                         type: string
 *                         example: "REF123"
 *                         description: The reference number of the missing part.
 *                       partNumber:
 *                         type: string
 *                         example: "PN12345"
 *                         description: The part number of the missing component.
 *                       partDescription:
 *                         type: string
 *                         example: "Description of the missing part"
 *                         description: The description of the missing component.
 *                       qnty:
 *                         type: integer
 *                         example: 5
 *                         description: The quantity of the missing component.
 *       400:
 *         description: Invalid project ID or other input errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid input parameters"
 *       500:
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Unexpected server error"
 */
/**
 * @swagger
 * /hub/uploadCRExcelFromHub:
 *   post:
 *     tags:
 *       - Project
 *     summary: Upload CR Excel from Hub and Generate Order Preview
 *     description: This endpoint processes an uploaded Excel file containing CR data from a hub, generates an order preview with switchboards, CRs, parts, and quantities.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The Excel file containing CR data to be uploaded.
 *     responses:
 *       200:
 *         description: Successfully processed the uploaded Excel file and generated the order preview.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Switchboards:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           switchBoard:
 *                             type: string
 *                             example: "Main Switchboard"
 *                             description: The name of the switchboard.
 *                           components:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 referenceNumber:
 *                                   type: string
 *                                   example: "CR1234"
 *                                   description: The reference number of the CR.
 *                                 description:
 *                                   type: string
 *                                   example: "Component Description"
 *                                   description: The description of the component.
 *                                 quantity:
 *                                   type: integer
 *                                   example: 10
 *                                   description: The quantity of the component.
 *                                 isCritical:
 *                                   type: boolean
 *                                   example: true
 *                                   description: Indicates if the component is critical.
 *                                 parts:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       partNumber:
 *                                         type: string
 *                                         example: "P12345"
 *                                         description: The part number.
 *                                       quantity:
 *                                         type: integer
 *                                         example: 5
 *                                         description: The quantity of the part.
 *                     PartList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           partNumber:
 *                             type: string
 *                             example: "P12345"
 *                             description: The part number.
 *                           quantity:
 *                             type: integer
 *                             example: 5
 *                             description: The quantity of the part.
 *                     ProjectDetails:
 *                       type: object
 *                       properties:
 *                         project_name:
 *                           type: string
 *                           example: "Project 1"
 *                         project_description:
 *                           type: string
 *                           example: "This is a test data"
 *       400:
 *         description: No file uploaded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "No file uploaded."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "server error"
 *                 data:
 *                   type: string
 *                   example: "Error details"
 */
/**
 * @swagger
 * /hub/createNewOrderFromHub:
 *   post:
 *     tags:
 *       - Project
 *     summary: Create a new project order in the tracking system
 *     description: This endpoint creates a new project in the tracking system by accepting project details, including switchboards, components, and parts, from the hub.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hub_id:
 *                 type: string
 *                 example: "12345"
 *                 description: The ID of the hub.
 *               spoke_id:
 *                 type: string
 *                 example: "54321"
 *                 description: The ID of the spoke.
 *               project_name:
 *                 type: string
 *                 example: "Project 1"
 *                 description: The name of the project.
 *               switchBoards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     switchBoard:
 *                       type: string
 *                       example: "Main Switchboard"
 *                       description: The name of the switchboard.
 *                     components:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           referenceNumber:
 *                             type: string
 *                             example: "CR1234"
 *                             description: The reference number of the component.
 *                           description:
 *                             type: string
 *                             example: "Component Description"
 *                             description: The description of the component.
 *                           quantity:
 *                             type: integer
 *                             example: 10
 *                             description: The quantity of the component.
 *                           isCritical:
 *                             type: boolean
 *                             example: true
 *                             description: Whether the component is critical.
 *                           parts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 partNumber:
 *                                   type: string
 *                                   example: "P12345"
 *                                   description: The part number.
 *                                 quantity:
 *                                   type: integer
 *                                   example: 5
 *                                   description: The quantity of the part.
 *     responses:
 *       200:
 *         description: Successfully created the new project order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "success"
 *       400:
 *         description: Bad request, missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 *       500:
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Unexpected server error"
 */
/**
 * @swagger
 * /hub/getAllProjects:
 *   post:
 *     tags:
 *       - Project
 *     summary: Fetch all available projects or a specific project based on ID.
 *     description: This endpoint fetches all available projects in the tracking system. It also supports fetching a specific project by its ID if provided.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The project ID to fetch a specific project. If not provided, all projects are fetched.
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully fetched project(s).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project(s) fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60e6b4cfc0e3d759f8f11a9d"
 *                       ProjectName:
 *                         type: string
 *                         example: "Project A"
 *                       createdBy:
 *                         type: string
 *                         example: "60e6b4cfc0e3d759f8f11a9d"
 *                       createdTo:
 *                         type: string
 *                         example: "2024-12-31"
 *                       status:
 *                         type: string
 *                         example: "Active"
 *                       totalComponents:
 *                         type: integer
 *                         example: 100
 *                       spokeName:
 *                         type: string
 *                         example: "John Doe"
 *       400:
 *         description: Bad request, if required input is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad request"
 *       500:
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unexpected server error"
 */
