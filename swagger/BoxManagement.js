/**
 * @swagger
 * /hub/addBoxToProject:
 *   post:
 *     tags:
 *       - Box
 *     summary: Add a box to a project
 *     description: This endpoint adds a box to a project by associating a serial number with the project.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectID:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b2"
 *                 description: The ID of the project to which the box will be added.
 *               serialNo:
 *                 type: string
 *                 example: "SN123456789"
 *                 description: The serial number of the box to be added to the project.
 *     responses:
 *       200:
 *         description: Box successfully added to the project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "605c72ef1532076f5f10d6b3"
 *                   description: The ID of the newly created box entry.
 *                 boxSerialNo:
 *                   type: string
 *                   example: "SN123456789"
 *                   description: The serial number of the box added to the project.
 *                 status:
 *                   type: string
 *                   example: "active"
 *                   description: The status of the box (e.g., active, inactive).
 *                 quantity:
 *                   type: integer
 *                   example: 1
 *                   description: The quantity of boxes with this serial number.
 *       400:
 *         description: Invalid input parameters (e.g., missing projectID or serialNo).
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
 *       404:
 *         description: Serial number not found in the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Serial number not found"
 *       409:
 *         description: A box with the given serial number already exists in the project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: "Box with this serial number already exists in the project"
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
 * /hub/removeBoxFromProject:
 *   post:
 *     tags:
 *       - Box
 *     summary: Remove a box from a project
 *     description: This endpoint removes a box from a project by its serial number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectID:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b2"
 *                 description: The ID of the project from which the box will be removed.
 *               serialNo:
 *                 type: string
 *                 example: "SN123456789"
 *                 description: The serial number of the box to be removed from the project.
 *     responses:
 *       200:
 *         description: Box successfully deleted from the project.
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
 *                   example: "Box Deleted from project successfully"
 *       400:
 *         description: Invalid input parameters (missing projectID or serialNo).
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
 *                   example: "Invalid input parameters plz provide projectID and serialNo (box serial no)"
 *       404:
 *         description: The box with the given serial number is not found in the project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Box not found in project"
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
 * /hub/addComponentsToBoxes:
 *   post:
 *     tags:
 *       - Box
 *     summary: Add components to a box in a project
 *     description: This endpoint adds a component to a box in a project, ensuring the component is available and doesn't exceed the quantity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hubID:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b2"
 *                 description: The ID of the hub where the component is located.
 *               componentID:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b3"
 *                 description: The ID of the component to be added to the box.
 *               boxSerialNo:
 *                 type: string
 *                 example: "SN123456789"
 *                 description: The serial number of the box to which the component will be added.
 *               projectID:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b4"
 *                 description: The ID of the project in which the box belongs.
 *               componentSerialNumber:
 *                 type: string
 *                 example: "CSN123456"
 *                 description: The serial number of the component to be added to the box.
 *     responses:
 *       200:
 *         description: Component successfully added to the box in the project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 boxid:
 *                   type: string
 *                   example: "605c72ef1532076f5f10d6b5"
 *                   description: The ID of the updated box.
 *                 totalComponents:
 *                   type: integer
 *                   example: 5
 *                   description: The total number of components in the box.
 *       201:
 *         description: The component is already in the project or exceeds the quantity limit.
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
 *                   example: "The ordered quantity of this item has been added to the box."
 *       400:
 *         description: Invalid input parameters or serial number already exists in the box.
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
 *                   example: "Serial number already exists for this component in the box."
 *       404:
 *         description: Not found (box, component, or hub).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Box serial number not found" / "Component ID not found" / "Hub ID not found"
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
 * /hub/getBoxDetails:
 *   post:
 *     tags:
 *       - Box
 *     summary: Get details of a box in a project
 *     description: This endpoint returns the details of a box in a project, including the components inside it, project details, and other related information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b7"
 *                 description: The ID of the box.
 *               serialNo:
 *                 type: string
 *                 example: "SN123456789"
 *                 description: The serial number of the box.
 *     responses:
 *       200:
 *         description: Box details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "605c72ef1532076f5f10d6b7"
 *                   description: The ID of the box.
 *                 status:
 *                   type: string
 *                   example: "active"
 *                   description: The status of the box.
 *                 quantity:
 *                   type: integer
 *                   example: 5
 *                   description: The total quantity of components in the box.
 *                 serialNo:
 *                   type: string
 *                   example: "SN123456789"
 *                   description: The serial number of the box.
 *                 projectId:
 *                   type: string
 *                   example: "605c72ef1532076f5f10d6b8"
 *                   description: The ID of the project the box belongs to.
 *                 components:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       componentID:
 *                         type: string
 *                         example: "605c72ef1532076f5f10d6b9"
 *                         description: The ID of the component.
 *                       serial:
 *                         type: string
 *                         example: "CSN123456"
 *                         description: The serial number of the component.
 *                       componentName:
 *                         type: string
 *                         example: "Component ABC"
 *                         description: The name of the component.
 *                       compDescription:
 *                         type: string
 *                         example: "Description of Component ABC"
 *                         description: The description of the component.
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                         description: The quantity of the component in the box.
 *                 projectName:
 *                   type: string
 *                   example: "Project A"
 *                   description: The name of the project the box is associated with.
 *       404:
 *         description: Box not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Box not found"
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
 * /hub/updateBoxStatus:
 *   post:
 *     tags:
 *       - Box
 *     summary: Update the status of a box
 *     description: This endpoint updates the status of a box to either 'open' or 'shipped'.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b7"
 *                 description: The ID of the box whose status needs to be updated.
 *               status:
 *                 type: string
 *                 enum: ["open", "shipped"]
 *                 example: "open"
 *                 description: The status to be set for the box. Valid values are "open" or "shipped".
 *     responses:
 *       200:
 *         description: The box status was updated successfully.
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
 *                   example: "Boxes closed successfully"
 *       400:
 *         description: Invalid input parameters or invalid status value.
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
 *                   example: "Both _id and status are required."
 *       404:
 *         description: The box with the provided ID was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Boxes not found."
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
 *                   example: "Internal server error."
 */
/**
 * @swagger
 * /hub/addPartsToBoxes:
 *   post:
 *     tags:
 *       - Box
 *     summary: Add a part to a box
 *     description: This endpoint adds a part to the box, checking the part's existence in the project and ensuring the serial number is valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hubID:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b7"
 *                 description: The ID of the hub where the part is located.
 *               partID:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b8"
 *                 description: The ID of the part being added to the box.
 *               boxSerialNo:
 *                 type: string
 *                 example: "B12345"
 *                 description: The serial number of the box where the part will be added.
 *               projectID:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b9"
 *                 description: The ID of the project associated with the box.
 *               partSerialNumber:
 *                 type: string
 *                 example: "PSN12345"
 *                 description: The serial number of the part to be added to the box.
 *     responses:
 *       200:
 *         description: Part added to the box successfully.
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
 *                   example: "Part added to box successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     boxid:
 *                       type: string
 *                       example: "605c72ef1532076f5f10d6b7"
 *                     totalParts:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Invalid input parameters or serial number already exists.
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
 *                   example: "Serial number already exists for this Part in the box"
 *       404:
 *         description: Part ID, Box serial number, or Hub ID not found, or invalid part serial number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Part ID not found"
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
 *                   example: "Unexpected server error"
 */
/**
 * @swagger
 * /hub/getAllPartsInAllBoxes:
 *   post:
 *     tags:
 *       - Box
 *     summary: Get all parts in specified boxes for a project
 *     description: This endpoint retrieves all parts across specified boxes for a given project, including their quantities.
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
 *                 description: The ID of the project for which parts will be fetched.
 *               boxSerialNos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "B12345"
 *                 description: The list of box serial numbers to search within.
 *     responses:
 *       200:
 *         description: Successfully fetched parts across all boxes for the project.
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
 *                   example: "All parts fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       componentID:
 *                         type: string
 *                         example: "605c72ef1532076f5f10d6b8"
 *                       partNumber:
 *                         type: string
 *                         example: "PN12345"
 *                       quantity:
 *                         type: integer
 *                         example: 10
 *       201:
 *         description: No parts found in the specified boxes for the project.
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
 *                   example: "No parts found"
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
 *                   example: "Unexpected server error"
 */
