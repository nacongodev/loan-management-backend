const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Loan Management API',
      version: '1.0.0',
      description: 'API documentation for the Loan Management System',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], // Paths to files containing JSDoc comments
};

const specs = swaggerJsdoc(options);

module.exports = specs;
