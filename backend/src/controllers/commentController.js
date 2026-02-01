const commentService = require('../services/commentService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/helpers');


function getComments(req, res) {
  const { page, limit } = req.query;
  const result = commentService.getComments(req.params.id, { page, limit });

  if (!result) return errorResponse(res, 404, 'NOT_FOUND', 'Ticket not found');

  return paginatedResponse(res, {
    items: result.items,
    total: result.total,
    page,
    limit,
  });
}


function createComment(req, res) {
  const comment = commentService.createComment(req.params.id, req.body);

  if (!comment) return errorResponse(res, 404, 'NOT_FOUND', 'Ticket not found');

  return successResponse(res, comment, 201);
}

module.exports = { getComments, createComment };
