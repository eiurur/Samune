const fs = require('fs');
const path = require('path');
// const im = require('imagemagick');
const ImageResizer = require('./ImageResizer');

module.exports = class PathImageResizer extends ImageResizer {
  constructor(url, filename, dstDir, canCleanupOriginalImage) {
    if (canCleanupOriginalImage == null) {
      canCleanupOriginalImage = true;
    }
    super(url, filename, dstDir, canCleanupOriginalImage);

    const originalFilepath = path.resolve(this.url);
    this.filename =
      this.filename || this.originalFilename.replace(this.ext, '');
    this.srcDir = path.resolve(originalFilepath.replace(this.originalFilename, ''));
    this.srcFilename = this.originalFilename;
  }

  isExistFile() {
    return new Promise((resolve, reject) =>
      fs.access(
        path.resolve(`${this.srcDir}/${this.srcFilename}`),
        fs.R_OK | fs.W_OK,
        (err) => {
          if (err) {
            return reject('image path is invalid');
          }
          return resolve(true);
        })
    );
  }

  exec(sizes) {
    return new Promise((resolve, reject) =>
      this.isExistFile()
        .then(_ => this.generateDestinationDirectory())
        .then((_) => {
          let promises = sizes.map((size) => this.resize(size));
          return Promise.all(promises);
        })
        .then((thuimbnailFilenameList) => {
          if (this.canCleanupOriginalImage) {
            this.cleanupOriginalImage();
          }
          return resolve(thuimbnailFilenameList);
        })
        .catch((err) => reject(err)))
  }
};
