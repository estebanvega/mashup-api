# mashup-api

## Requirements
* Docker Engine > 1.13.0

## Running containerized setup
Container running Caddy server, proxying and caching requests to mashup-api.
Separate container running mashup-api, based on minimal docker image with Node.js.

Run and build with:
`docker-compose up --build`