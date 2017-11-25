const request = require('supertest');
const app = require('../server.js').app;
const server = require('../server.js').server;
const urljoin = require('url-join');

describe('GET /api/artist', () => {
  after(function(done) {
    server.close();
    done();
  });

  it('should return 200 OK', done => {
    request(app)
      .get('/api/artist')
      .expect(200, done);
  });

  it('should return JSON response', done => {
    const artistId = '81739b1e-609d-4a63-beaa-4422ca5e278a';
    const reqUrl = urljoin('/api/artist/', artistId);

    request(app)
      .get(reqUrl)
      .expect(
        200,
        {
          mbid: artistId,
          name: 'Le Knight Club'
        },
        done
      );
  });
});
