const path = require("path");
const randomstring = require("randomstring");
const ImageResizer = require("./ImageResizer");
const URLChecker = require("./URLChecker");

module.exports = class URLImageResizer extends ImageResizer {
  constructor(url, filename, dstDir, canCleanupOriginalImage = true, imageMagickCustomArgs) {
    super(url, filename, dstDir, canCleanupOriginalImage, imageMagickCustomArgs);

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
      this.generateDestinationDirectory();
      await this.write();
      // const promises = sizes.map(size => this.resize(size));
      // const thuimbnailFilenameList = await Promise.all(promises);
      const thuimbnailFilenameList = await this.resizeReduce(sizes);
      if (this.canCleanupOriginalImage) {
        this.cleanupOriginalImage();
      }
      return thuimbnailFilenameList;
    } catch (err) {
      throw new Error(err);
    }
  }
};
