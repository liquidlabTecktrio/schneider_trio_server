/**
 * @swagger
 * /hub/componentScanResult:
 *   post:
 *     tags:
 *       - Parts
 *     summary: Get scan result for a component and its related project and box details
 *     description: This endpoint retrieves details about a component based on its ID and serial number, including project information, switchboard details, and the box serial number where the component is located.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               componentID:
 *                 type: string
 *                 example: "605c72ef1532076f5f10d6b7"
 *                 description: The ID of the component to scan.
 *               serialNo:
 *                 type: string
 *                 example: "SN123456789"
 *                 description: The serial number of the component.
 *     responses:
 *       200:
 *         description: Successfully found the component and its related project and box details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projectName:
 *                   type: string
 *                   example: "Project ABC"
 *                 projectID:
 *                   type: string
 *                   example: "605c72ef1532076f5f10d6b7"
 *                 componentName:
 *                   type: string
 *                   example: "Component XYZ"
 *                 componentDescription:
 *                   type: string
 *                   example: "This is the description of the component."
 *                 switchBoardData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       switchBoardName:
 *                         type: string
 *                         example: "Switchboard 1"
 *                       quantity:
 *                         type: integer
 *                         example: 10
 *                       fixedQuantity:
 *                         type: integer
 *                         example: 5
 *                 boxSerialNo:
 *                   type: string
 *                   example: "B12345"
 *       401:
 *         description: Invalid QR code or serial number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid QRCode or Invalid Serial Number"
 *       404:
 *         description: Component or serial number not found, or component not found in any project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Component not found in any project"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /admin/createPart:
 *   post:
 *     tags:
 *       - Parts
 *     summary: Create a new part in the system
 *     description: This endpoint creates a new part in the system with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partNumber:
 *                 type: string
 *                 example: "PN12345"
 *                 description: The part number of the new part.
 *               partDescription:
 *                 type: string
 *                 example: "High-efficiency filter"
 *                 description: A brief description of the part.
 *               quantity:
 *                 type: integer
 *                 example: 100
 *                 description: The initial quantity of the part.
 *               grouped:
 *                 type: boolean
 *                 example: true
 *                 description: Whether the part is grouped with others.
 *               PiecePerPacket:
 *                 type: integer
 *                 example: 10
 *                 description: The number of pieces per packet.
 *     responses:
 *       200:
 *         description: Part created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *       409:
 *         description: PartNumber already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "PartNumber Exist"
 *                 existingPart:
 *                   type: object
 *                   properties:
 *                     partNumber:
 *                       type: string
 *                       example: "PN12345"
 *                     partDescription:
 *                       type: string
 *                       example: "High-efficiency filter"
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     grouped:
 *                       type: boolean
 *                       example: true
 *                     PiecePerPacket:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unexpected server error"
 */
/**
 * @swagger
 * /admin/getAllParts:
 *   get:
 *     tags:
 *       - Parts
 *     summary: Get all parts
 *     description: This endpoint retrieves all parts from the system, excluding certain fields like parentIds and quantity.
 *     responses:
 *       200:
 *         description: All parts fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   partNumber:
 *                     type: string
 *                     example: "PN12345"
 *                   partDescription:
 *                     type: string
 *                     example: "High-efficiency filter"
 *                   grouped:
 *                     type: boolean
 *                     example: true
 *                   PiecePerPacket:
 *                     type: integer
 *                     example: 10
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unexpected server error"
 */
