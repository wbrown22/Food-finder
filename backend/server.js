const http = require('http');
const app = require('./app');

//port that is provided or localhost:3000
const port = process.env.PORT || 4000;

//create server with given port and app
const server = http.createServer(app)

server.listen(port);
