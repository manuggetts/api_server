const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API com Swagger',
      version: '1.0.0',
      description: 'Exemplo',
    },
  },
  apis: ['./index.js'], // comments que viram docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;