const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = lowDb(new FileSync('customPackageDb.json'));
db.defaults({ packages: [
  {
    "id": "09779538",
    "products": [
      "EyXYiNFsakej-Q4VEgSIQ",
      "ebZWdYAThJke5slt71npP"
    ]
  }
] }).write();

module.exports = db;