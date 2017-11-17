const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const routes = require('./server/routes.js');
routes(app);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


const port = process.env.PORT || '3001';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, '0.0.0.0', () => console.log(`Running on localhost:${port}`));