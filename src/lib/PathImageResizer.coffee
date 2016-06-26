fs           = require 'fs'
path         = require 'path'
im           = require 'imagemagick'
ImageResizer = require './ImageResizer'


module.exports = class PathImageResizer extends ImageResizer

  constructor: (url, filename, dstDir, canCleanupOriginalImage = true) ->
    super(url, filename, dstDir, canCleanupOriginalImage)

    originalFilepath = path.resolve(@url)
    @filename        = @filename or @originalFilename.replace(@ext, '')
    @srcDir          = path.resolve(originalFilepath.replace(@originalFilename, ''))
    @srcFilename     = @originalFilename

  isExistFile: ->
    return new Promise (resolve, reject) =>
      fs.access path.resolve("#{@srcDir}/#{@srcFilename}"), fs.R_OK | fs.W_OK, (err) =>
        if err then return reject 'image path is invalid'
        return resolve true

  identify: ->
    return new Promise (resolve, reject) =>
      im.identify path.resolve("#{@srcDir}/#{@srcFilename}")
      , (err, features) =>
        if err then return reject 'image path or url is invalid'
        return resolve features

  exec: (sizes) ->
    return new Promise (resolve, reject) =>
      @isExistFile()
      .then (_) => @generateDestinationDirectory()
      .then (_) =>
        promises = sizes.map (size) => return @resize(size)
        Promise.all promises
      .then (thuimbnailFilenameList) =>
        if @canCleanupOriginalImage then @cleanupOriginalImage()
        return resolve thuimbnailFilenameList
      .catch (err) ->
        return reject err
