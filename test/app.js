const request = require('supertest');
const app = require('../server.js').app;
const server = require('../server.js').server;
const urljoin = require('url-join');

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-things'));

describe('GET /api/artist/:mbid', () => {
  after(function(done) {
    server.close();
    done();
  });

  it('should return JSON response', done => {
    const artistId = '81739b1e-609d-4a63-beaa-4422ca5e278a';
    const reqUrl = urljoin('/api/artist/', artistId);

    request(app)
      .get(reqUrl)
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property('mbid');
        expect(res.body.mbid).to.equal(artistId);

        expect(res.body).to.have.property('name');
        expect(res.body.name).to.equal('Le Knight Club');

        expect(res.body).to.have.property('description');
        expect(res.body.description).to.not.equal(null);

        expect(res.body).to.have.property('albums');
        expect(res.body.albums).to.be.an('array').that.is.not.empty;

        expect(res.body.albums).to.all.have.property('id');
        expect(res.body.albums).to.all.have.property('title');
        expect(res.body.albums).to.all.have.property('image');

        done();
      });
  });
});
