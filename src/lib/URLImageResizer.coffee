randomstring = require 'randomstring'
ImageResizer = require './ImageResizer'


module.exports = class URLImageResizer extends ImageResizer

  constructor: (url, filename, dstDir, canCleanupOriginalImage) ->
    super(url, filename, dstDir, canCleanupOriginalImage)

    @filename    = @filename or randomstring.generate()
    @srcDir      = @dstDir
    @srcFilename = "#{@filename}#{@ext}"

  exec: (sizes) ->
    return new Promise (resolve, reject) =>
      @generateDestinationDirectory()
      .then (_) =>
        @write()
      .then (filename) =>
        promises = sizes.map (size) => return @resize(size)
        Promise.all promises
      .then (thuimbnailFilenameList) =>
        if @canCleanupOriginalImage then @cleanupOriginalImage()
        return resolve thuimbnailFilenameList
      .catch (err) ->
        return reject err
