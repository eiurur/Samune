path         = require 'path'
ImageResizer = require './ImageResizer'


module.exports = class PathImageResizer extends ImageResizer

  constructor: (url, filename, dstDir, canCleanupOriginalImage = true) ->
    super(url, filename, dstDir, canCleanupOriginalImage)

    originalFilepath = path.resolve(@url)
    @filename        = @filename or @originalFilename.replace(@ext, '')
    @srcDir          = path.resolve(originalFilepath.replace(@originalFilename, ''))
    @srcFilename     = @originalFilename

  exec: (sizes) ->
    return new Promise (resolve, reject) =>
      @generateDestinationDirectory()
      .then (_) =>
        promises = sizes.map (size) => return @resize(size)
        Promise.all promises
      .then (thuimbnailFilenameList) =>
        if @canCleanupOriginalImage then @cleanupOriginalImage()
        return resolve thuimbnailFilenameList
      .catch (err) ->
        return reject err
