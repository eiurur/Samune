const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class DirectoryManager {

  static existsSync(dir) {
    return fs.existsSync(dir);
  }

  static generateSync(dir) {
    return fs.existsSync(dir) || mkdirp.sync(dir);
  }
};
