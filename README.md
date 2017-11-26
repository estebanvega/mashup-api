# mashup-api

## Running containerized setup

### Requirements
* Docker Engine > 1.13.0

Container running Caddy server, proxying and caching requests to mashup-api.
Separate container running mashup-api, based on minimal docker image with Node.js.

Run and build with:
`$ docker-compose up --build`


## Running locally with process manager, PM2

### Requirements
* Node.js > 8.0
* PM2 (npm install -g pm2)

Startup:
`$ npm start`

Tailing logs:
`$ pm2 logs mashup-api`
