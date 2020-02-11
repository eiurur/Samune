const fsp = require('fs-extra');
const mkdirp = require('mkdirp');

module.exports = class DirectoryManager {
  static async exists(dir) {
    return await fsp.pathExists(dir);
  }

  static async generate(dir) {
    return await fsp.pathExists(dir) || mkdirp.sync(dir);
  }
};
