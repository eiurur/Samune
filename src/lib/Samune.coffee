_                = require 'lodash'
URLChecker       = require './URLChecker'
URLImageResizer  = require './URLImageResizer'
PathImageResizer = require './PathImageResizer'

module.exports = class Samune

  constructor: (opts) ->
    if URLChecker.isURL opts.url
      @imageResizer = new URLImageResizer(opts.url, opts.filename, opts.dstDir, opts.canCleanupOriginalImage)
    else
      @imageResizer = new PathImageResizer(opts.url, opts.filename, opts.dstDir, opts.canCleanupOriginalImage)

  identify: ->
    return new Promise (resolve, reject) =>
      @imageResizer.isExistFile()
      .then (_) => @imageResizer.identify()
      .then (features) -> return resolve features
      .catch (err) => return reject new Error err


  generate: (sizes) ->
    return new Promise (resolve, reject) =>
      sizes = if _.isArray(sizes) then sizes else [sizes]
      throw new Error 'sizes is empty' if _.isUndefined _.first sizes
      throw new Error 'sizes include NaN' unless sizes.every (size) -> return _.isNumber size

      @imageResizer.isExistFile()
      .then (_) => @imageResizer.exec(sizes)
      .then (thuimbnailFilenameList) -> return resolve thuimbnailFilenameList
      .catch (err) -> return reject new Error err
