fs           = require 'fs'
_            = require 'lodash'
path         = require 'path'
ImageResizer = require './ImageResizer'

module.exports = class Samune extends ImageResizer

  constructor: (opts) ->
    super(opts.url, opts.filename, opts.dstDir, opts.canCleanupOriginalImage)

  generate: (sizes) ->
    return new Promise (resolve, reject) =>
      @sizes = if _.isArray(sizes) then sizes else [sizes]
      throw new Error 'sizes is empty' if _.isUndefined _.first @sizes
      throw new Error 'sizes include NaN' unless @sizes.every (size) -> return _.isNumber size

      @exec(@sizes)
      .then (thuimbnailFilenameList) -> return resolve thuimbnailFilenameList
      .catch (err) -> return reject err
