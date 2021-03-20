const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = lowDb(new FileSync('customPackageDb.json'));
db.defaults({ packages: [] }).write();

module.exports = db;