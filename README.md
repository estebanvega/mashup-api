# mashup-api

## Running containerized setup

### Requirements
* Docker Engine > 1.13.0

Container running Caddy server, proxying and caching requests to mashup-api.
Separate container running mashup-api, using minimal docker image with Node.js.

First time usage, run and build with:
`$ docker-compose up --build`

Example artist lookups (source: https://musicbrainz.org)
- Le Knight Club: http://localhost/api/artist/81739b1e-609d-4a63-beaa-4422ca5e278a
- The Phantom's Revenge: http://localhost/api/artist/bf6f4ceb-2deb-4242-8950-74f7e1272c17

## Running locally with process manager, PM2

### Requirements
* Node.js > 8.0
* PM2 (npm install -g pm2)

Start API:
`$ npm start`

Tailing logs:
`$ pm2 logs mashup-api`

Stop API:
`$ pm2 stop mashup-api`

# Testing
- Test framework: Mocha
- Assertion library: Chai
- HTTP assertions: supertest

Running tests:

`$ npm test`

Running tests in watch mode:

`$ npm run watch:test`