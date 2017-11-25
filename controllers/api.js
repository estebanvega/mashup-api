const rp = require('request-promise');
const urljoin = require('url-join');

/**
 * GET /api/artist/:mbid
 */
exports.getArtist = (req, res) => {
  const mbid = req.params.mbid;

  getMusicBrainz(mbid)
    .then(mbRes => getWikipedia(mbRes))
    .then(wikiRes => getAlbumCoverArts(wikiRes))
    .then(apiRes => {
      return res.status(200).json(apiRes);
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
        name: parsedBody.name,
        albums: mapReleasesToAlbums(parsedBody['release-groups']) 
      };
    })
    .catch(err => {
      return err;
    });
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
 * Request Cover Art Archive API with release id:s as param
 */
const getSingleCoverArt = albumObj => {
  const baseUrl = 'https://coverartarchive.org/release-group/';
  const url = urljoin(baseUrl, albumObj.id);

  const options = {
    uri: url,
    headers: {
      'User-Agent': 'mashup-api'
    },
    resolveWithFullResponse: false,
    json: true
  };

  return rp(options)
    .then(body => {
      const images = body.images;
      const firstEntry = images[Object.keys(images)[0]];

      return Object.assign(
        {
          id: albumObj.id,
          image: firstEntry.image
        },
        albumObj
      );
    })
    .catch(err => {
      console.log('err msg: ', err.message);

      return Object.assign(
        {
          id: albumObj.id,
          image: 'No cover art available'
        },
        albumObj
      );
    });
};

/**
 * Request all album covers for a specific artist
 */
const getAlbumCoverArts = artistObj => {
  let albumWithCoverArts = [];

  for (let album of artistObj.albums) {
    albumWithCoverArts.push(getSingleCoverArt(album));
  }

  return Promise.all(albumWithCoverArts)
    .then(updatedAlbums => {
      Object.assign(artistObj.albums, updatedAlbums);

      return artistObj; 
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
