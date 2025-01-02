
/**
 * @swagger
 * /hub/createhubuser:
 *   post:
 *     summary: "Create a new hub user"
 *     description: "This endpoint creates a new user for a specified hub."
 *     tags:
 *       - HubManagement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - phonenumber
 *               - hub_id
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *               phonenumber:
 *                 type: string
 *                 example: "+1234567890"
 *               hub_id:
 *                 type: string
 *                 example: "60d7259cdbd4e8f7c8b5c539"
 *     responses:
 *       200:
 *         description: "Hub user created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "hub user created successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d7259cdbd4e8f7c8b5c539"
 *                       HubName:
 *                         type: string
 *                         example: "Main Hub"
 *                       HubUsers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             username:
 *                               type: string
 *                               example: "john_doe"
 *                             phonenumber:
 *                               type: string
 *                               example: "+1234567890"
 *       401:
 *         description: "Unexpected server error during save operation"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "unexpected server error"
 *       500:
 *         description: "Unexpected server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "unexpected server error"
 */

/**
 * @swagger
 * /hub/getallhubusers:
 *   post:
 *     summary: "Retrieve all users of a specific hub"
 *     description: "This endpoint retrieves all users associated with a specified hub."
 *     tags:
 *       - HubManagement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hub_id
 *             properties:
 *               hub_id:
 *                 type: string
 *                 example: "60d7259cdbd4e8f7c8b5c539"
 *     responses:
 *       200:
 *         description: "Hub users retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "hub user created successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *                       phonenumber:
 *                         type: string
 *                         example: "+1234567890"
 *       400:
 *         description: "Invalid request - missing required fields"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "All fields are required: hub_id"
 *       500:
 *         description: "Unexpected server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "unexpected server error"
 */