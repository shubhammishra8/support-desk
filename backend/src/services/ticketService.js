const { v4: uuidv4 } = require('uuid');
const ticketRepo = require('../repositories/ticketRepository');

function formatTicket(row) {
  if (!row) return null;
  return {
    id:          row.id,
    title:       row.title,
    description: row.description,
    status:      row.status,
    priority:    row.priority,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  };
}

function listTickets(filters) {
  const { rows, total } = ticketRepo.findAll(filters);
  return { items: rows.map(formatTicket), total };
}

function getTicket(id) {
  const row = ticketRepo.findById(id);
  return formatTicket(row);
}

function createTicket({ title, description, priority }) {
  const now = new Date().toISOString();
  const row = ticketRepo.create({
    id: uuidv4(),
    title,
    description,
    priority,
    now,
  });
  return formatTicket(row);
}

function updateTicket(id, fields) {
  const existing = ticketRepo.findById(id);
  if (!existing) return null;

  const row = ticketRepo.update(id, {
    ...fields,
    updatedAt: new Date().toISOString(),
  });
  return formatTicket(row);
}

function deleteTicket(id) {
  return ticketRepo.remove(id);
}

module.exports = { listTickets, getTicket, createTicket, updateTicket, deleteTicket };
