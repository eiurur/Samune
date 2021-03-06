const path = require('path');
const randomstring = require('randomstring');
const ImageResizer = require('./ImageResizer');
const URLChecker = require('./URLChecker');

module.exports = class URLImageResizer extends ImageResizer {
  constructor({
    url,
    filename,
    dstDir,
    resizeOptions
  }) {
    super({url, filename, dstDir, resizeOptions});

    this.filename = this.filename || randomstring.generate();
    this.srcDir = this.dstDir;
    this.srcFilename = `${this.filename}${this.ext}`;
  }

  async isExistFile() {
    try {
      const res = await URLChecker.isValidURL(this.url);
      return res;
    } catch (err) {
      throw new Error('[Samune] image url is invalid');
    }
  }


  async exec(sizes) {
    try {
      await this.generateDestinationDirectory();
      await this.write();
      const thuimbnailFilenameList = await this.resizeReduce(sizes);
      return thuimbnailFilenameList;
    } catch (err) {
      throw new Error(err);
    }
  }
};
