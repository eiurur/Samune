// Generated by CoffeeScript 1.10.0
(function() {
  var ImageResizer, PathImageResizer, fs, im, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  path = require('path');

  im = require('imagemagick');

  ImageResizer = require('./ImageResizer');

  module.exports = PathImageResizer = (function(superClass) {
    extend(PathImageResizer, superClass);

    function PathImageResizer(url, filename, dstDir, canCleanupOriginalImage) {
      var originalFilepath;
      if (canCleanupOriginalImage == null) {
        canCleanupOriginalImage = true;
      }
      PathImageResizer.__super__.constructor.call(this, url, filename, dstDir, canCleanupOriginalImage);
      originalFilepath = path.resolve(this.url);
      this.filename = this.filename || this.originalFilename.replace(this.ext, '');
      this.srcDir = path.resolve(originalFilepath.replace(this.originalFilename, ''));
      this.srcFilename = this.originalFilename;
    }

    PathImageResizer.prototype.isExistFile = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return fs.access(path.resolve(_this.srcDir + "/" + _this.srcFilename), fs.R_OK | fs.W_OK, function(err) {
            if (err) {
              return reject('image path is invalid');
            }
            return resolve(true);
          });
        };
      })(this));
    };

    PathImageResizer.prototype.identify = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return im.identify(path.resolve(_this.srcDir + "/" + _this.srcFilename), function(err, features) {
            if (err) {
              return reject('image path or url is invalid');
            }
            return resolve(features);
          });
        };
      })(this));
    };

    PathImageResizer.prototype.exec = function(sizes) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.isExistFile().then(function(_) {
            return _this.generateDestinationDirectory();
          }).then(function(_) {
            var promises;
            promises = sizes.map(function(size) {
              return _this.resize(size);
            });
            return Promise.all(promises);
          }).then(function(thuimbnailFilenameList) {
            if (_this.canCleanupOriginalImage) {
              _this.cleanupOriginalImage();
            }
            return resolve(thuimbnailFilenameList);
          })["catch"](function(err) {
            return reject(err);
          });
        };
      })(this));
    };

    return PathImageResizer;

  })(ImageResizer);

}).call(this);
