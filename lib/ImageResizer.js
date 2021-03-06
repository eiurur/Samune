const fsp = require('fs-extra');
const sharp = require('sharp');
const path = require('path');
const url = require('url');
const request = require('request');
const DirectoryManager = require('./DirectoryManager');
const gifResize = require('@gumlet/gif-resize');

module.exports = class ImageResizer {
  constructor(
    _url,
    filename,
    dstDir,
    canCleanupOriginalImage = true,
    resizeOptions = {}
  ) {
    this.url = _url;
    this.filename = this.getFilename(_url, filename);
    this.dstDir = dstDir;
    this.canCleanupOriginalImage = canCleanupOriginalImage;
    this.resizeOptions = resizeOptions;
    this.originalFilename = _url.split('/').pop();
    this.ext = path.extname(this.originalFilename) || '.jpg';
  }

  getFilename(_url, filename) {
    return (
      filename ||
      path.basename(
        url.parse(_url).pathname,
        path.extname(url.parse(_url).pathname)
      )
    ); // デフォはurlのファイル名
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

  async resize(width, src, dst) {
    src = src || `${this.srcDir}/${this.srcFilename}`;
    dst = dst || `${this.dstDir}/${this.filename}_w${width}${this.ext}`;
    const srcPath = path.resolve(src);
    const dstPath = path.resolve(dst);
    const format = this.ext.replace('.', '');
    if(format === "gif") {
      const buf = await fsp.readFile(srcPath);
      const data = await gifResize({width})(buf)
      await fsp.writeFile(dstPath, data)
    }
    else {
      await sharp(srcPath)
      .resize(width)
      .toFormat(format, this.resizeOptions)
      .toFile(dstPath);
    }
    return {
      width,
      filename: `${this.filename}_w${width}${this.ext}`,
      path: dstPath,
    };
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
        result.unshift(
          await this.resize(prev.width || width, prev.path || null, null)
        );
        prev = result[0].width;
      }
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  write() {
    return new Promise((resolve, reject) => {
      const ws = fsp.createWriteStream(
        `${this.dstDir}/${this.filename}${this.ext}`
      );
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
