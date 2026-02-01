const express = require('express');
const ticketController  = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');
const { validateBody, validateQuery } = require('../middleware');
const {
  CreateTicketSchema,
  UpdateTicketSchema,
  TicketQuerySchema,
  CreateCommentSchema,
  CommentQuerySchema,
} = require('../utils/schemas');

const router = express.Router();



/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: List tickets
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search query (title or description)
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [OPEN, IN_PROGRESS, RESOLVED] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [newest, oldest], default: newest }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *     responses:
 *       200:
 *         description: Paginated ticket list
 */
router.get('/', validateQuery(TicketQuerySchema), ticketController.listTickets);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:       { type: string, minLength: 5, maxLength: 80 }
 *               description: { type: string, minLength: 20, maxLength: 2000 }
 *               priority:    { type: string, enum: [LOW, MEDIUM, HIGH], default: MEDIUM }
 *     responses:
 *       201:
 *         description: Created ticket
 *       400:
 *         description: Validation error
 */
router.post('/', validateBody(CreateTicketSchema), ticketController.createTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a single ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ticket detail
 *       404:
 *         description: Not found
 */
router.get('/:id', ticketController.getTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   patch:
 *     summary: Update a ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:       { type: string }
 *               description: { type: string }
 *               status:      { type: string, enum: [OPEN, IN_PROGRESS, RESOLVED] }
 *               priority:    { type: string, enum: [LOW, MEDIUM, HIGH] }
 *     responses:
 *       200:
 *         description: Updated ticket
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.patch('/:id', validateBody(UpdateTicketSchema), ticketController.updateTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete a ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', ticketController.deleteTicket);



/**
 * @swagger
 * /tickets/{id}/comments:
 *   get:
 *     summary: List comments for a ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 15, maximum: 50 }
 *     responses:
 *       200:
 *         description: Paginated comments
 *       404:
 *         description: Ticket not found
 */
router.get('/:id/comments', validateQuery(CommentQuerySchema), commentController.getComments);

/**
 * @swagger
 * /tickets/{id}/comments:
 *   post:
 *     summary: Add a comment to a ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [authorName, message]
 *             properties:
 *               authorName: { type: string, maxLength: 100 }
 *               message:    { type: string, maxLength: 500 }
 *     responses:
 *       201:
 *         description: Created comment
 *       400:
 *         description: Validation error
 *       404:
 *         description: Ticket not found
 */
router.post('/:id/comments', validateBody(CreateCommentSchema), commentController.createComment);

module.exports = router;
