const request = require('supertest');
const app = require('../server.js').app;
const server = require('../server.js').server;

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
    request(app)
      .get('/api/artist')
      .expect(
        200,
        {
          mbid: '81739b1e-609d-4a63-beaa-4422ca5e278a',
          name: 'Le Knight Club'
        },
        done
      );
  });
});
