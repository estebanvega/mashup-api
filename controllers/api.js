const rp = require('request-promise');
const urljoin = require('url-join');

/**
 * GET /api/artist
 */
exports.getArtist = (req, res) => {
  res.status(200).json({ name: 'Le Knight Club' });
};

/**
 * GET /api/musicbrainz/id
 */
exports.getMusicBrainz = (req, res, next) => {
  const baseUrl = 'https://musicbrainz.org/ws/2/artist/';
  const url = urljoin(baseUrl, req.params.id);

  const options = {
    uri: url,
    qs: {
      fmt: 'json',
      inc: 'url-rels+release-groups'
    },
    headers: {
      'User-Agent': 'mashup-api'
    },
    resolveWithFullResponse: false,
    json: false
  };

  rp(options)
    .then(body => {
      const parsedBody = JSON.parse(body);
      return next(parsedBody.name);
    })
    .catch(err => {
      return next(err);
    });
};