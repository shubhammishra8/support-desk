const { getDb } = require('../utils/database');





function findAll({ q, status, priority, sort, page, limit }) {
  const db = getDb();
  const conditions = [];
  const params = [];

  if (q) {
    conditions.push(`(title LIKE ? OR description LIKE ?)`);
    const pattern = `%${q}%`;
    params.push(pattern, pattern);
  }
  if (status) {
    conditions.push(`status = ?`);
    params.push(status);
  }
  if (priority) {
    conditions.push(`priority = ?`);
    params.push(priority);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderClause = `ORDER BY created_at ${sort === 'oldest' ? 'ASC' : 'DESC'}`;
  const offset = (page - 1) * limit;

  
  const countRow = db.prepare(`SELECT COUNT(*) as total FROM tickets ${whereClause}`).get(...params);

  
  const rows = db
    .prepare(`SELECT * FROM tickets ${whereClause} ${orderClause} LIMIT ? OFFSET ?`)
    .all(...params, limit, offset);

  return { rows, total: countRow.total };
}



function findById(id) {
  return getDb().prepare('SELECT * FROM tickets WHERE id = ?').get(id);
}



function create({ id, title, description, priority, now }) {
  getDb()
    .prepare(`
      INSERT INTO tickets (id, title, description, status, priority, created_at, updated_at)
      VALUES (?, ?, ?, 'OPEN', ?, ?, ?)
    `)
    .run(id, title, description, priority, now, now);

  return findById(id);
}




function update(id, fields) {
  const db = getDb();
  const setClauses = [];
  const params = [];

  if (fields.title !== undefined)       { setClauses.push('title = ?');       params.push(fields.title); }
  if (fields.description !== undefined) { setClauses.push('description = ?'); params.push(fields.description); }
  if (fields.status !== undefined)      { setClauses.push('status = ?');      params.push(fields.status); }
  if (fields.priority !== undefined)    { setClauses.push('priority = ?');    params.push(fields.priority); }

  setClauses.push('updated_at = ?');
  params.push(fields.updatedAt);
  params.push(id);

  db.prepare(`UPDATE tickets SET ${setClauses.join(', ')} WHERE id = ?`).run(...params);
  return findById(id);
}



function remove(id) {
  const result = getDb().prepare('DELETE FROM tickets WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = { findAll, findById, create, update, remove };
