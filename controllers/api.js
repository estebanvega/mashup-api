const rp = require('request-promise');
const urljoin = require('url-join');

/**
 * GET /api/artist/:mbid
 */
exports.getArtist = (req, res) => {
  const mbid = req.params.mbid;

  getMusicBrainz(mbid)
    .then(mbRes => getWikipedia(mbRes))
    .then(wikiRes => {
      res.status(200).json(wikiRes);
    });
};

/**
 * Request MusicBrainz API with artist ID as param
 */
const getMusicBrainz = mbid => {
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
 * Request Wikipedia API with artist name as param
 */
const getWikipedia = artistObj => {
  const baseUrl = 'https://en.wikipedia.org/w/api.php';

  const options = {
    uri: baseUrl,
    qs: {
      action: 'query',
      format: 'json',
      prop: 'extracts',
      exintro: true,
      redirects: true,
      titles: artistObj.name
    },
    headers: {
      'User-Agent': 'mashup-api'
    },
    resolveWithFullResponse: false,
    json: true
  };

  return rp(options)
    .then(body => {
      const pages = body.query.pages;
      const firstPage = pages[Object.keys(pages)[0]];

      return Object.assign(artistObj, { description: firstPage.extract });
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
