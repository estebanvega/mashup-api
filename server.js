const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const logger = new winston.Logger({
  transports: [new winston.transports.Console({ timestamp: true })]
});

/**
 * Controllers
 */
const apiController = require('./controllers/api');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
const PORT = process.env.PORT || 8000;
app.set('host', '0.0.0.0');
app.set('port', PORT);
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('<a href="/api/artist">API example</a>');
});

app.get('/api/artist/:mbid', apiController.getArtist);

/**
 * Error Handler.
 */
app.use(function(err, req, res, next) {
  logger.error(err);

  res.json({ message: err.message });
});


/**
 * Start Express server.
 */
const server = app.listen(PORT, () => {
  logger.info('Running at http://localhost:%s', PORT);
});

module.exports = {
  server: server,
  app: app
};
