const rp = require('request-promise');
const urljoin = require('url-join');
const Promise = require('bluebird');

const winston = require('winston');
const logger = new winston.Logger({
  transports: [new winston.transports.Console({ timestamp: true })]
});

/**
 * GET /api/artist/:mbid
 */
exports.getArtist = (req, res, next) => {
  const mbid = req.params.mbid;

  getMusicBrainz(mbid, next)
    .then(mbRes => {
      return Promise.join(
        getWikipedia(mbRes),
        getAlbumCoverArts(mbRes.albums),
        (resolvedDesc, resolvedAlbums) => {
          return Object.assign(
            {
              description: resolvedDesc,
              albums: resolvedAlbums
            },
            mbRes
          );
        }
      );
    })
    .then(result => res.status(200).json(result))
    .catch(err => next(new Error(err)));
};

/**
 * Request MusicBrainz API with artist ID as param
 */
const getMusicBrainz = (mbid, next) => {
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
        name: parsedBody.name,
        albums: mapReleasesToAlbums(parsedBody['release-groups'])
      };
    })
    .catch(err => next(new Error(err)));
};

const mapReleasesToAlbums = releaseGroups => {
  let albums = [];

  for (let release of releaseGroups) {
    albums.push({
      id: release.id,
      title: release.title
    });
  }

  return albums;
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

  logger.info('Sending request to Wikipedia API');

  return rp(options)
    .then(body => {
      const pages = body.query.pages;
      const firstPage = pages[Object.keys(pages)[0]];

      return Object.assign(artistObj, { description: firstPage.extract });
    })
    .catch(err => {
      logger.error('Wikipedia API response: %s', err);

      return Object.assign(artistObj, { description: 'No description found' });
    });
};

/**
 * Request Cover Art Archive API with release id:s as param
 */
const getSingleCoverArt = album => {
  const baseUrl = 'https://coverartarchive.org/release-group/';
  const url = urljoin(baseUrl, album.id);

  const options = {
    uri: url,
    headers: {
      'User-Agent': 'mashup-api'
    },
    resolveWithFullResponse: false,
    json: true
  };

  logger.info('Sending request to Cover Art API: %s', album.id);

  return rp(options)
    .then(body => {
      const images = body.images;
      const firstEntry = images[Object.keys(images)[0]];

      return Object.assign(
        {
          image: firstEntry.image
        },
        album
      );
    })
    .catch(err => {
      logger.error('Cover Art API response: %s', err);

      return Object.assign(
        {
          id: album.id,
          image: 'No cover art available'
        },
        album
      );
    });
};

/**
 * Request all album covers for a specific artist
 */
const getAlbumCoverArts = albums => {
  let albumWithCoverArts = [];

  for (let album of albums) {
    albumWithCoverArts.push(getSingleCoverArt(album));
  }

  return Promise.all(albumWithCoverArts).then(updatedAlbums =>
    Object.assign(albums, updatedAlbums)
  );
};
