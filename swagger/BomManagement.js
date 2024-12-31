/**
 * @swagger
 * /api/admin/upload-cr:
 *   post:
 *     tags:
 *       - BOM Management
 *     summary: Upload BOM file to create new CR records
 *     description: This endpoint allows the admin to upload a BOM file that will be processed to create new Commercial Reference (CR) records.
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
 *                 description: BOM file to be uploaded in Excel format (.xlsx)
 *     responses:
 *       200:
 *         description: BOM file uploaded and processed successfully.
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
 *                   example: "Upload successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     createdNewParts:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["CR12345", "CR67890"]
 *                       description: List of newly created CR reference numbers.
 *       400:
 *         description: No file uploaded or invalid file format.
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
 *         description: Internal server error or file processing issue.
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
 *                   example: "Server error"
 *                 data:
 *                   type: string
 *                   example: "Error details"
 */
/**
 * @swagger
 * /api/admin/create-cr:
 *   post:
 *     tags:
 *       - BOM Management
 *     summary: Create a new CR with associated parts
 *     description: This endpoint creates a new Commercial Reference (CR) with a list of parts. Each part must exist in the database and will be linked to the new CR.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referenceNumber:
 *                 type: string
 *                 example: "CR12345"
 *                 description: Unique reference number for the CR.
 *               description:
 *                 type: string
 *                 example: "Description of the commercial reference"
 *                 description: A detailed description of the CR.
 *               productNumber:
 *                 type: string
 *                 example: "P123"
 *                 description: The product number associated with the CR.
 *               partNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["P001", "P002"]
 *                 description: List of part numbers associated with the CR.
 *     responses:
 *       200:
 *         description: CR created successfully with linked parts.
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
 *                     crReferenceNumber:
 *                       type: string
 *                       example: "CR12345"
 *                       description: The reference number of the created CR.
 *       404:
 *         description: Part does not exist, cannot create CR without valid parts.
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
 *                   example: "Part does not exist, add part first"
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
 *                   example: "Server error"
 *                 data:
 *                   type: string
 *                   example: "Error details"
 */
/**
 * @swagger
 * /api/admin/delete-cr:
 *   post:
 *     tags:
 *       - BOM Management
 *     summary: Delete a Commercial Reference (CR)
 *     description: This endpoint allows an admin to mark a CR as inactive by providing its reference number. The CR will not be completely deleted but will be marked as inactive.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referenceNumber:
 *                 type: string
 *                 example: "CR12345"
 *                 description: The unique reference number of the CR to be deleted/marked as inactive.
 *     responses:
 *       200:
 *         description: CR successfully marked as inactive.
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
 *       409:
 *         description: CR not found, unable to delete.
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
 *                   example: "ReferenceNumber do not exist"
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
 *                   example: "Server error"
 *                 data:
 *                   type: string
 *                   example: "Error details"
 */
/**
 * @swagger
 * /api/admin/recover-cr:
 *   post:
 *     tags:
 *       - BOM Management
 *     summary: Recover a Commercial Reference (CR)
 *     description: This endpoint helps to change the status of a CR from inactive (`isActive: false`) to active (`isActive: true`) by providing the CR's `_id`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "60c72b2f5f1b2c001f5f1b2c"
 *                 description: The unique MongoDB ObjectId of the CR to be recovered.
 *     responses:
 *       200:
 *         description: CR successfully recovered and marked as active.
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
 *       409:
 *         description: CR not found, unable to recover.
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
 *                   example: "ReferenceNumber do not exist"
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
 *                   example: "Server error"
 *                 data:
 *                   type: string
 *                   example: "Error details"
 */

