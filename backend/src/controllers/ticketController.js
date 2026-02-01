const ticketService = require('../services/ticketService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/helpers');


function listTickets(req, res) {
  const { q, status, priority, sort, page, limit } = req.query;
  const { items, total } = ticketService.listTickets({ q, status, priority, sort, page, limit });
  return paginatedResponse(res, { items, total, page, limit });
}


function getTicket(req, res) {
  const ticket = ticketService.getTicket(req.params.id);
  if (!ticket) return errorResponse(res, 404, 'NOT_FOUND', 'Ticket not found');
  return successResponse(res, ticket);
}


function createTicket(req, res) {
  const ticket = ticketService.createTicket(req.body);
  return successResponse(res, ticket, 201);
}


function updateTicket(req, res) {
  const ticket = ticketService.updateTicket(req.params.id, req.body);
  if (!ticket) return errorResponse(res, 404, 'NOT_FOUND', 'Ticket not found');
  return successResponse(res, ticket);
}


function deleteTicket(req, res) {
  const deleted = ticketService.deleteTicket(req.params.id);
  if (!deleted) return errorResponse(res, 404, 'NOT_FOUND', 'Ticket not found');
  return res.status(204).end();
}

module.exports = { listTickets, getTicket, createTicket, updateTicket, deleteTicket };
