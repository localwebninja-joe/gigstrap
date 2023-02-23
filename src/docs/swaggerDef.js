const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'node-express using weaviate database API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/localwebninja-joe/gigstrap.git',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
