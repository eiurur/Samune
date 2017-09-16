const fs = require('fs');
const im = require('imagemagick');
const path = require('path');
const url = require('url');
const request = require('request');
const DirectoryManager = require('./DirectoryManager');

module.exports = class ImageResizer {
  constructor(_url, filename, dstDir, canCleanupOriginalImage, imageMagickCustomArgs = []) {
    this.url = _url;
    this.filename = filename || path.basename(url.parse(_url).pathname, path.extname(url.parse(_url).pathname)); // デフォはurlのファイル名
    this.dstDir = dstDir;
    if (canCleanupOriginalImage === null) {
      canCleanupOriginalImage = true;
    }
    this.canCleanupOriginalImage = canCleanupOriginalImage;
    this.imageMagickCustomArgs = imageMagickCustomArgs;
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
        customArgs: this.imageMagickCustomArgs
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

  async exec(sizes) {
    return [];
  }
};
