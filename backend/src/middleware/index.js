const { ZodError } = require('zod');
const { logger, errorResponse } = require('../utils/helpers');




function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
  });
  next();
}





function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return formatValidationError(res, result.error);
    }
    req.body = result.data;
    next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return formatValidationError(res, result.error);
    }
    req.query = result.data;
    next();
  };
}

function formatValidationError(res, zodError) {
  const details = zodError.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
  return res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Input validation failed',
      details,
    },
  });
}




function errorHandler(err, req, res, _next) {
  logger.error('Unhandled error:', err);

  if (err instanceof ZodError) {
    return formatValidationError(res, err);
  }

  
  if (err.code === 'SQLITE_CONSTRAINT') {
    return errorResponse(res, 409, 'CONFLICT', err.message);
  }

  return errorResponse(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred');
}

module.exports = { requestLogger, validateBody, validateQuery, errorHandler };
