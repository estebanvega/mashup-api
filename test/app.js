const request = require('supertest');
const app = require('../server.js');

describe('GET /api/artist', () => {
    it('should return 200 OK', (done) => {
        request(app)
            .get('/api/artist')
            .expect(200, done);
    });
});