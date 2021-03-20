const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = lowDb(new FileSync('packageDb.json'));
const { setId } = require('../utils');

const packages = [
    {
      "id": setId(),
      "name": "Minimal",
      "description": "36.6 products included",
      "products": [],
      "price": ""
    },
    {
      "id": setId(),
      "name": "Standard",
      "description": "Standard products included",
      "products": [],
      "price": ""
    },
    {
      "id": setId(),
      "name": "Premium",
      "description": "Premium products included",
      "products": [],
      "price": ""
    }
  ];

db.defaults({ packages }).write();

module.exports = db;
