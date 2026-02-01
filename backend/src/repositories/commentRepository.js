const { getDb } = require('../utils/database');




function findByTicket(ticketId, { page, limit }) {
  const db = getDb();
  const offset = (page - 1) * limit;

  const countRow = db
    .prepare('SELECT COUNT(*) as total FROM comments WHERE ticket_id = ?')
    .get(ticketId);

  const rows = db
    .prepare('SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .all(ticketId, limit, offset);

  return { rows, total: countRow.total };
}



function create({ id, ticketId, authorName, message, now }) {
  getDb()
    .prepare(`
      INSERT INTO comments (id, ticket_id, author_name, message, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(id, ticketId, authorName, message, now);

  return getDb().prepare('SELECT * FROM comments WHERE id = ?').get(id);
}

module.exports = { findByTicket, create };
