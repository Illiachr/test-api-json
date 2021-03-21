const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const lowDb = require('lowdb');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const FileSync = require('lowdb/adapters/FileSync');

const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

const app = express();
const productsRouter = require('./routes/productRouter');
const packagesRouter = require('./routes/packagesRouter');
const db = lowDb(new FileSync('db.json'));
const packageDb = require('./models/packagesModel');
const customPackageDb = require('./models/customPackagesModel');

const PORT = process.env.PORT || '3001';
const products = [
    {
      "id": nanoid(),
      "name": "product 1",
      "description": "product 1",
      "price": 1000
    },
    {
      "id": nanoid(),
      "name": "product 2",
      "description": "product 2",
      "price": 1500
    },
    {
      "id": nanoid(),
      "name": "product 3",
      "description": "product 3",
      "price": 2000
    }
  ];

db.defaults({ products }).write();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Catalog JSON API",
      version: "0.0.1",
      descripition: "Mock API for Catalog service"
    },
    servers: [
      {
        url: "https://mysterious-fortress-82468.herokuapp.com/api/v0/catalog"        
      }
    ]
  },
  apis: ["./routes/*.js"]
};

// "http://localhost:3001/api/v0/catalog"

const specs = swaggerJsDoc(options);

app.db = db;
app.packageDb = packageDb;
app.customPackageDb = customPackageDb;
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api/v0/catalog/products', productsRouter);
app.use('/api/v0/catalog/packages', packagesRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.listen(PORT, () => {
  console.warn(`JSON server is running  on http://localhost:${PORT}`);
});

