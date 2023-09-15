require('dotenv').config();

const Server = require('./www/server');


const server = new Server();



server.listen();


