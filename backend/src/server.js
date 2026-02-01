const app    = require('./app');
const { logger } = require('./utils/helpers');

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  logger.info(`Support Desk API running on port ${PORT} (${NODE_ENV})`);
  logger.info(`Swagger docs available at /api/docs`);
});
