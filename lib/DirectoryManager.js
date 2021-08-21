const fsp = require('fs-extra');

module.exports = class DirectoryManager {
  static async exists(dir) {
    return await fsp.pathExists(dir);
  }

  static async generate(dir) {
    return (await fsp.pathExists(dir)) || (await fsp.mkdirs(dir));
  }
};
