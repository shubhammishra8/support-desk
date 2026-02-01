const express    = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi   = require('swagger-ui-express');
const path        = require('path');

const { requestLogger, errorHandler } = require('./middleware');
const ticketRoutes = require('./routes/tickets');
const { logger }   = require('./utils/helpers');

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

app.use(requestLogger);

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title:   'Mini Support Desk API',
      version: '1.0.0',
      description: 'REST API for managing support tickets and comments',
    },
    servers: [{ url: '/api' }],
  },
  apis: [path.resolve(__dirname, 'routes', '*.js')],
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/swagger.json', (req, res) => res.json(swaggerSpec));

app.use('/api/tickets', ticketRoutes);

app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` } });
});

app.use(errorHandler);

require('./utils/database').getDb();
logger.info('Database initialised');

module.exports = app;
