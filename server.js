const express = require('express');

/**
 * Controllers
 */
const apiController = require('./controllers/api');

/**
 * Create Express server.
 */
const app = express();
const port = 8000;

app.get('/', function (req, res) {
    res.send('<a href=\"/api/artist\">API example</a>');
});

app.get('/api/artist', apiController.getArtist);

/**
 * Start Express server.
 */
app.listen(port, () => {
    console.log('We are live on ' + port);
});

module.exports = app;