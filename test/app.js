const request = require('supertest');
const app = require('./server.js').app;
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

  it('should return artist name', done => {
    request(app)
      .get('/api/artist')
      .expect(
        200,
        {
          name: 'Le Knight Club'
        },
        done
      );
  });
});
