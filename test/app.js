const request = require('supertest');
const app = require('../server.js').app;
const server = require('../server.js').server;
const urljoin = require('url-join');

describe('GET /api/artist/:mbid', () => {
  after(function(done) {
    server.close();
    done();
  });

  it('should return JSON response', done => {
    const artistId = '81739b1e-609d-4a63-beaa-4422ca5e278a';
    const reqUrl = urljoin('/api/artist/', artistId);
    const desc = '<p><b>Guillaume Emmanuel "Guy-Manuel" de Homem-Christo</b> (<small>French pronunciation: ​</small><span title="Representation in the International Phonetic Alphabet (IPA)">[ɡi manɥɛl də ɔmɛm kʁisto]</span>; born 8 February 1974) is a French musician, record producer, singer, songwriter, DJ and film director, best known for being one half of the French house music duo Daft Punk, along with Thomas Bangalter. He has also produced several works from his record label Crydamoure with label co-owner Éric Chedeville. He and Chedeville formed the musical duo <b>Le Knight Club</b>.</p> <p></p> <p></p>';

    request(app)
      .get(reqUrl)
      .expect(
        200,
        {
          mbid: artistId,
          name: 'Le Knight Club',
          description: desc
        },
        done
      );
  });
});
