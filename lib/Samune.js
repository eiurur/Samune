const _ = require('lodash');
const URLChecker = require('./URLChecker');
const URLImageResizer = require('./URLImageResizer');
const PathImageResizer = require('./PathImageResizer');

module.exports = class Samune {
  constructor(opts) {
    this.opts = opts;
    this.imageResizer = this.buildImageResizer();
  }

  buildImageResizer() {
    if (URLChecker.isURL(this.opts.url)) {
      return new URLImageResizer(this.opts)
    }
    return new PathImageResizer(this.opts);
  }

  // TODO: URLだけサポート
  async getFileSizeByte() {
    return await URLChecker.getFileSizeByte();
  }

  async generate(size) {
    const sizes = Array.isArray(size) ? size : [size];
    if (_.isUndefined(sizes[0])) {
      throw new Error('sizes is empty');
    }
    const isAllNumbers = sizes.every((size) => _.isNumber(size));
    if (!isAllNumbers) {
      throw new Error('sizes include NaN');
    }
    await this.imageResizer.isExistFile();
    const thuimbnailFilenameList = await this.imageResizer.exec(sizes);
    return thuimbnailFilenameList;
  }
};
