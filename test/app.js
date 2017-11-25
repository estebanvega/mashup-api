const request = require('supertest');
const app = require('../server.js').app;
const server = require('../server.js').server;
const urljoin = require('url-join');
const expect = require('chai').expect;

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
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property('mbid');
        expect(res.body.mbid).to.equal(artistId);

        expect(res.body).to.have.property('name');
        expect(res.body.name).to.equal('Le Knight Club');

        expect(res.body).to.have.property('description');
        expect(res.body.description).to.not.equal(null);

        done();
      });
  });
});
