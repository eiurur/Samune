const fs = require('fs');
const im = require('imagemagick');
const path = require('path');
const request = require('request');
const DirectoryManager = require('./DirectoryManager');

module.exports = class ImageResizer {
  constructor(url, filename, dstDir, canCleanupOriginalImage) {
    this.url = url;
    this.filename = filename;
    this.dstDir = dstDir;
    if (canCleanupOriginalImage == null) {
      canCleanupOriginalImage = true;
    }
    this.canCleanupOriginalImage = canCleanupOriginalImage;
    this.originalFilename = this.url.split('/').pop();
    this.ext = path.extname(this.originalFilename) || '.jpg';
  }

  generateDestinationDirectory() {
    return new Promise((resolve, reject) => {
      if (!this.dstDir) {
        return reject('dstDir is invalid');
      }
      return resolve(DirectoryManager.generateSync(this.dstDir));
    });
  }

  cleanupOriginalImage() {
    const filepath = `${this.dstDir}/${this.filename}${this.ext}`;
    if (DirectoryManager.existsSync(filepath)) {
      fs.unlink(filepath);
    }
  }


  resize(width) {
    return new Promise((resolve, reject) => {
      var options = {
        srcPath: path.resolve(`${this.srcDir}/${this.srcFilename}`),
        dstPath: path.resolve(`${this.dstDir}/${this.filename}_w${width}${this.ext}`),
        format: this.ext.replace('.', ''),
        width: width,
        customArgs: ["-define", `jpeg:size=${width}x30`]
      };
      return im.resize(options
        , (err, stdout) => {
          if (err) { return reject(err); }
          return resolve(`${this.filename}_w${width}${this.ext}`);
        });
    });
  }

  write() {
    return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(`${this.dstDir}/${this.filename}${this.ext}`);
      request(this.url).pipe(ws);
      ws.on('finish', () => resolve(`${this.filename}${this.ext}`));
      return ws.on('error', (err) => {
        ws.end();
        return reject(err);
      });
    });
  }
};
