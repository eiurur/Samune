const _ = require('lodash');
const URLChecker = require('./URLChecker');
const URLImageResizer = require('./URLImageResizer');
const PathImageResizer = require('./PathImageResizer');

module.exports = class Samune {
  constructor(opts) {
    if (URLChecker.isURL(opts.url)) {
      this.imageResizer = new URLImageResizer(
        opts.url,
        opts.filename,
        opts.dstDir,
        opts.canCleanupOriginalImage);
    } else {
      this.imageResizer = new PathImageResizer(
        opts.url,
        opts.filename,
        opts.dstDir,
        opts.canCleanupOriginalImage);
    }
  }

  // TODO: URLだけサポート
  getFileSizeBite() {
    return new Promise((resolve, reject) =>
      URLChecker.getFileSizeBite()
        .then((bite) => resolve(bite))
        .catch((err) => reject(new Error(err))));
  }

  generate(sizes) {
    return new Promise((resolve, reject) => {
      sizes = _.isArray(sizes) ? sizes : [sizes];
      if (_.isUndefined(_.first(sizes))) {
        throw new Error('sizes is empty');
      }
      if (
        !sizes.every((size) => _.isNumber(size))
      ) {
        throw new Error('sizes include NaN');
      }

      return this.imageResizer
        .isExistFile()
        .then(_ => this.imageResizer.exec(sizes))
        .then(thuimbnailFilenameList => resolve(thuimbnailFilenameList))
        .catch(err => reject(new Error(err)));
    });
  }
};
