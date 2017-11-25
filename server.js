const express = require('express');
const bodyParser = require('body-parser');

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
const port = 8000;
app.set('host', '0.0.0.0');
app.set('port', port);
app.use(bodyParser.json());


app.get('/', function (req, res) {
  res.send('<a href="/api/artist">API example</a>');
});

app.get('/api/artist/:mbid', apiController.getArtist);
app.get('/api/musicbrainz/:id', apiController.getMusicBrainz);

/**
 * Start Express server.
 */
const server = app.listen(port, () => {
  console.info('We are live on ' + port);
});

module.exports = {
  server: server,
  app: app
};