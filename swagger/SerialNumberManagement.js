/**
 * @swagger
 * /api/parts/generate-serial:
 *   post:
 *     tags:
 *       - Serial Number
 *     summary: Generate serial numbers for parts
 *     description: This endpoint generates serial numbers for parts based on the provided quantity. If the part is grouped, serial numbers are generated based on packets.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The part and quantity details for generating serial numbers.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             hubID:
 *               type: string
 *               example: "60e6b4cfc0e3d759f8f11a9d"
 *             partID:
 *               type: string
 *               example: "60e6b6b4c0e3d759f8f11a9e"
 *             partNumber:
 *               type: string
 *               example: "PN12345"
 *             qnty:
 *               type: integer
 *               example: 100
 *     responses:
 *       200:
 *         description: Serial numbers generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hubID:
 *                   type: string
 *                   example: "60e6b4cfc0e3d759f8f11a9d"
 *                 partID:
 *                   type: string
 *                   example: "60e6b6b4c0e3d759f8f11a9e"
 *                 partNumber:
 *                   type: string
 *                   example: "PN12345"
 *                 partDescription:
 *                   type: string
 *                   example: "PN12345 - High-efficiency filter"
 *                 qnty:
 *                   type: integer
 *                   example: 100
 *                 grouped:
 *                   type: boolean
 *                   example: true
 *                 serialNos:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "t3aKjs"
 *                 PiecePerPacket:
 *                   type: array
 *                   items:
 *                     type: integer
 *                     example: 10
 *       400:
 *         description: Invalid input, quantity must be a number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Quantity (qnty) is required and must be a number"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
/**
 * @swagger
 * /api/boxes/generate-serial:
 *   post:
 *     tags:
 *       - Serial Number
 *     summary: Generate serial numbers for boxes
 *     description: This endpoint generates serial numbers for boxes based on the provided quantity.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The hub ID and quantity of boxes for which serial numbers are to be generated.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             hubID:
 *               type: string
 *               example: "60e6b4cfc0e3d759f8f11a9d"
 *             qnty:
 *               type: integer
 *               example: 50
 *     responses:
 *       200:
 *         description: Box serial numbers generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hubID:
 *                   type: string
 *                   example: "60e6b4cfc0e3d759f8f11a9d"
 *                 boxSerialNos:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "t3aKjs000001"
 *       400:
 *         description: Invalid input parameters, either hubID or quantity (qnty) is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input parameters"
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
