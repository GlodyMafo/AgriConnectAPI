const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Events API',
    description: 'Project2'
  },
  host: 'agriconnectapi.onrender.com',
  schemes:['http']
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);


