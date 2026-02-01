const { v4: uuidv4 } = require('uuid');
const commentRepo  = require('../repositories/commentRepository');
const ticketRepo   = require('../repositories/ticketRepository');

function formatComment(row) {
  if (!row) return null;
  return {
    id:         row.id,
    ticketId:   row.ticket_id,
    authorName: row.author_name,
    message:    row.message,
    createdAt:  row.created_at,
  };
}

function getComments(ticketId, { page, limit }) {
  const ticket = ticketRepo.findById(ticketId);
  if (!ticket) return null;

  const { rows, total } = commentRepo.findByTicket(ticketId, { page, limit });
  return { items: rows.map(formatComment), total };
}

function createComment(ticketId, { authorName, message }) {
  const ticket = ticketRepo.findById(ticketId);
  if (!ticket) return null;

  const now = new Date().toISOString();
  const row = commentRepo.create({
    id: uuidv4(),
    ticketId,
    authorName,
    message,
    now,
  });
  return formatComment(row);
}

module.exports = { getComments, createComment };
