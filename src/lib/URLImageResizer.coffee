path         = require 'path'
im           = require 'imagemagick'
randomstring = require 'randomstring'
ImageResizer = require './ImageResizer'
URLChecker   = require './URLChecker'

module.exports = class URLImageResizer extends ImageResizer

  constructor: (url, filename, dstDir, canCleanupOriginalImage) ->
    super(url, filename, dstDir, canCleanupOriginalImage)

    @filename    = @filename or randomstring.generate()
    @srcDir      = @dstDir
    @srcFilename = "#{@filename}#{@ext}"

  isExistFile: ->
    return new Promise (resolve, reject) =>
      URLChecker.isValidURL(@url)
      .then (response) => return resolve response
      .catch (err) => return reject 'image url is invalid'

  identify: ->
    return new Promise (resolve, reject) =>
      @generateDestinationDirectory()
      .then (_) => @write()
      .then (filename) =>
        im.identify path.resolve("#{@dstDir}/#{@srcFilename}")
        , (err, features) =>
          if err then return reject 'image path or url is invalid'
          @cleanupOriginalImage()
          return resolve features

  exec: (sizes) ->
    return new Promise (resolve, reject) =>
      @generateDestinationDirectory()
      .then (_) => @write()
      .then (filename) =>
        promises = sizes.map (size) => return @resize(size)
        Promise.all promises
      .then (thuimbnailFilenameList) =>
        if @canCleanupOriginalImage then @cleanupOriginalImage()
        return resolve thuimbnailFilenameList
      .catch (err) ->
        return reject err
