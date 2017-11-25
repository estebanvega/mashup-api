const rp = require('request-promise');
const urljoin = require('url-join');

/**
 * GET /api/artist/:mbid
 */
exports.getArtist = (req, res) => {
  const mbid  = req.params.mbid;

  getMusicBrainz(mbid).then(response => {
    res.status(200).json(response);
  });
};

const getMusicBrainz = (mbid) => {
  const baseUrl = 'https://musicbrainz.org/ws/2/artist/';
  const url = urljoin(baseUrl, mbid);

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

  return rp(options)
    .then(body => {
      const parsedBody = JSON.parse(body);

      return {
        mbid: parsedBody.id,
        name: parsedBody.name
      };
    })
    .catch(err => {
      return err;
    });
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