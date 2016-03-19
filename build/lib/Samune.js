// Generated by CoffeeScript 1.10.0
(function() {
  var ImageResizer, Samune, _, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  _ = require('lodash');

  path = require('path');

  ImageResizer = require('./ImageResizer');

  module.exports = Samune = (function(superClass) {
    extend(Samune, superClass);

    function Samune(opts) {
      Samune.__super__.constructor.call(this, opts.url, opts.filename, opts.dstDir, opts.canCleanupOriginalImage);
    }

    Samune.prototype.generate = function(sizes) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this.sizes = _.isArray(sizes) ? sizes : [sizes];
          if (_.isUndefined(_.first(_this.sizes))) {
            throw new Error('sizes is empty');
          }
          if (!_this.sizes.every(function(size) {
            return _.isNumber(size);
          })) {
            throw new Error('sizes include NaN');
          }
          return _this.exec(_this.sizes).then(function(thuimbnailFilenameList) {
            return resolve(thuimbnailFilenameList);
          })["catch"](function(err) {
            return reject(err);
          });
        };
      })(this));
    };

    return Samune;

  })(ImageResizer);

}).call(this);
