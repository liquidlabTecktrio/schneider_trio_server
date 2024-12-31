/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Admin Login
 *     description: Authenticates an admin using their username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: mysecurepassword
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI...
 *                     username:
 *                       type: string
 *                       example: admin123
 *                     id:
 *                       type: string
 *                       example: 60c72b2f5f1b2c001f5f1b2c
 *                     level:
 *                       type: string
 *                       example: superadmin
 *       201:
 *         description: Incorrect username/password
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
 *                   example: username/password is incorrect!!!
 *       202:
 *         description: Validation error or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 202
 *                 message:
 *                   type: string
 *                   example: username and password should not be empty
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/hubs/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Hub login
 *     description: Authenticates a hub using the provided username and password, returning an authentication key if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hubUsername:
 *                 type: string
 *                 example: "centralhub"
 *                 description: The username of the hub.
 *               hubPassword:
 *                 type: string
 *                 example: "securepassword123"
 *                 description: The password of the hub.
 *     responses:
 *       200:
 *         description: Login successful.
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
 *                   example: "Login successfully"
 *                 data:
 *                   type: object
 *                   description: Hub details.
 *                   properties:
 *                     hubName:
 *                       type: string
 *                     hubShortName:
 *                       type: string
 *                     hubUsername:
 *                       type: string
 *                     hubPassword:
 *                       type: string
 *                     logo_ZPL:
 *                       type: string
 *       401:
 *         description: Invalid username or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Invalid username or password"
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
 *                 data:
 *                   type: string
 *                   example: "Error details"
 */
/**
 * @swagger
 * /api/hubs:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Create a new hub
 *     description: This endpoint allows creating a new hub with details such as name, username, password, and a logo in ZPL format.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hubName:
 *                 type: string
 *                 example: "Central Hub"
 *                 description: The full name of the hub.
 *               hubShortName:
 *                 type: string
 *                 example: "CH"
 *                 description: The short name or abbreviation of the hub.
 *               hubUsername:
 *                 type: string
 *                 example: "centralhub"
 *                 description: The username for hub login.
 *               hubPassword:
 *                 type: string
 *                 example: "securepassword123"
 *                 description: The password for hub login.
 *               logo_ZPL:
 *                 type: string
 *                 example: "^XA^FO50,50^GB200,200,200^FS^XZ"
 *                 description: The logo for the hub in ZPL format.
 *     responses:
 *       200:
 *         description: Hub created successfully.
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
 *                   example: "hub created successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       hubName:
 *                         type: string
 *                       hubShortName:
 *                         type: string
 *                       hubUsername:
 *                         type: string
 *                       hubPassword:
 *                         type: string
 *                       logo_ZPL:
 *                         type: string
 *       401:
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "unexpected server error"
 *                 data:
 *                   type: string
 *                   example: "Error details"
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
 *                   example: "unexpected server error"
 *                 data:
 *                   type: string
 *                   example: "Error details"
 */
