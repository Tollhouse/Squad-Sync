const server = require('./src/server');

const port = 3000;

server.listen(port, () => console.log(`Express server listening on ${port}`));