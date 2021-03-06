const fsp = require('fs-extra');
const path = require('path');
const ImageResizer = require('./ImageResizer');

module.exports = class PathImageResizer extends ImageResizer {
  constructor({
    url,
    filename,
    dstDir,
    resizeOptions
  }) {
    super({url, filename, dstDir, resizeOptions});

    const originalFilepath = path.resolve(this.url);
    this.filename =
      this.filename || this.originalFilename.replace(this.ext, '');
    this.srcDir = path.resolve(
      originalFilepath.replace(this.originalFilename, '')
    );
    this.srcFilename = this.originalFilename;
  }

  async isExistFile() {
    try {
      await fsp.access(
        path.resolve(`${this.srcDir}/${this.srcFilename}`),
        fsp.constants.R_OK | fsp.constants.W_OK
      );
      return true;
    } catch (err) {
      throw new Error('[Samune] image path is invalid');
    }
  }

  async exec(sizes) {
    try {
      await this.isExistFile();
      await this.generateDestinationDirectory();
      const thuimbnailFilenameList = await this.resizeReduce(sizes);
      return thuimbnailFilenameList;
    } catch (err) {
      throw new Error(err);
    }
  }
};
