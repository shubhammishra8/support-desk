

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'info'];

function log(level, ...args) {
  if (LOG_LEVELS[level] <= currentLevel) {
    const timestamp = new Date().toISOString();
    console[level === 'debug' ? 'log' : level](`[${timestamp}] [${level.toUpperCase()}]`, ...args);
  }
}

const logger = {
  error: (...args) => log('error', ...args),
  warn:  (...args) => log('warn', ...args),
  info:  (...args) => log('info', ...args),
  debug: (...args) => log('debug', ...args),
};



function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json(data);
}

function errorResponse(res, statusCode, code, message) {
  return res.status(statusCode).json({
    error: { code, message },
  });
}

function paginatedResponse(res, { items, total, page, limit }) {
  return res.status(200).json({
    data: items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}

module.exports = { logger, successResponse, errorResponse, paginatedResponse };
