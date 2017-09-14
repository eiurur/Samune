const path = require("path");
// const im = require('imagemagick');
const randomstring = require("randomstring");
const ImageResizer = require("./ImageResizer");
const URLChecker = require("./URLChecker");

module.exports = class URLImageResizer extends ImageResizer {
  constructor(url, filename, dstDir, canCleanupOriginalImage) {
    super(url, filename, dstDir, canCleanupOriginalImage);

    this.filename = this.filename || randomstring.generate();
    this.srcDir = this.dstDir;
    this.srcFilename = `${this.filename}${this.ext}`;
  }

  isExistFile() {
    return new Promise((resolve, reject) =>
      URLChecker.isValidURL(this.url)
        .then(response => {
          return resolve(response);
        })
        .catch(err => {
          return reject("image url is invalid");
        })
    );
  }

  exec(sizes) {
    return new Promise((resolve, reject) =>
      this.generateDestinationDirectory()
        .then(_ => this.write())
        .then(filename => {
          var promises = sizes.map(size => {
            return this.resize(size);
          });
          return Promise.all(promises);
        })
        .then(thuimbnailFilenameList => {
          if (this.canCleanupOriginalImage) {
            this.cleanupOriginalImage();
          }
          return resolve(thuimbnailFilenameList);
        })
        .catch(err => {
          return reject(err);
        })
    );
  }
};
