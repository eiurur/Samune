const fsp = require('fs-extra');
const im = require('imagemagick');
const path = require('path');
const url = require('url');
const request = require('request');
const DirectoryManager = require('./DirectoryManager');

module.exports = class ImageResizer {
  constructor(_url, filename, dstDir, canCleanupOriginalImage = true, imageMagickCustomArgs = []) {
    this.url = _url;
    this.filename = this.getFilename(_url, filename);
    this.dstDir = dstDir;
    this.canCleanupOriginalImage = canCleanupOriginalImage;
    this.imageMagickCustomArgs = imageMagickCustomArgs;
    this.originalFilename = _url.split('/').pop();
    this.ext = path.extname(this.originalFilename) || '.jpg';
  }

  getFilename(_url, filename) {
    return filename || path.basename(url.parse(_url).pathname, path.extname(url.parse(_url).pathname)); // デフォはurlのファイル名
  }

  async generateDestinationDirectory() {
    if (!this.dstDir) {
      throw new Error('dstDir is invalid');
    }
    return await DirectoryManager.generate(this.dstDir);
  }

  async cleanupOriginalImage() {
    const filepath = `${this.dstDir}/${this.filename}${this.ext}`;
    const existFile = await DirectoryManager.exists(filepath);
    if (existFile) {
      await fsp.remove(filepath);
    }
  }

  resize(width, src, dst) {
    // this.dstFilename = `${this.filename}_w${width}${this.ext}`;
    return new Promise((resolve, reject) => {
      src = src || `${this.srcDir}/${this.srcFilename}`;
      dst = dst || `${this.dstDir}/${this.filename}_w${width}${this.ext}`;
      const options = {
        srcPath: path.resolve(src),
        dstPath: path.resolve(dst),
        format: this.ext.replace('.', ''),
        width,
        customArgs: this.imageMagickCustomArgs,
      };
      return im.resize(options,
        (err, stdout) => {
          if (err) { return reject(err); }
          return resolve({
            width,
            filename: `${this.filename}_w${width}${this.ext}`,
            path: path.resolve(dst),
          });
        });
    });
  }

  /**
   * オリジナル画像を平行リサイズするより
   * 畳み込みでリサイズしていく方が効率的
   * @param {*} widths
   */
  async resizeReduce(widths) {
    let prev = {};
    const result = [];
    const descingWidths = widths.sort((a, b) => b - a); // 大きい方からリサイズしていく
    try {
      for (const width of descingWidths) {
        result.unshift(await this.resize(prev.width || width, prev.path || null, null));
        prev = result[0].width;
      }
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  write() {
    return new Promise((resolve, reject) => {
      const ws = fsp.createWriteStream(`${this.dstDir}/${this.filename}${this.ext}`);
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
