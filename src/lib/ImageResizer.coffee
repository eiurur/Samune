fs           = require 'fs'
im           = require 'imagemagick'
mkdirp       = require 'mkdirp'
path         = require 'path'
randomstring = require 'randomstring'
request      = require 'request'

module.exports = class ImageResizer

  constructor: (@url, @filename, @dstDir, @canCleanupOriginalImage = true) ->
    filename = @url.split('/').pop()
    @ext = path.extname(filename) or '.jpg'

    if @isURL()
      @filename = (@filename or randomstring.generate())
      @srcDir = @dstDir
      @srcFilename = "#{@filename}#{@ext}"
    else # path
      filepath = path.resolve(@url)
      @filename = filename.replace(@ext, '')
      @srcDir = path.resolve(filepath.replace(filename, ''))
      @srcFilename = filename

  isURL: ->
    url_pattern = /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\\,%#]+)$/
    return url_pattern.test @url

  exec: (sizes) ->
    return new Promise (resolve, reject) =>
      # todo: これってここ？
      throw new Error 'dstDir is invalid' if !@dstDir

      @generateDir()

      # HACK: 汚い
      if @isURL()
        @write()
        .then (filename) =>
          promises = sizes.map (size) => return @resize(size)
          Promise.all promises
        .then (thuimbnailFilenameList) =>
          if @canCleanupOriginalImage then @cleanupOriginalImage()
          return resolve thuimbnailFilenameList
        .catch (err) ->
          return reject err
      else
        promises = sizes.map (size) => return @resize(size)
        Promise.all promises
        .then (thuimbnailFilenameList) =>
          if @canCleanupOriginalImage then @cleanupOriginalImage()
          return resolve thuimbnailFilenameList
        .catch (err) ->
          return reject err

  generateDir: ->
    fs.existsSync(@dstDir) or mkdirp.sync(@dstDir)

  cleanupOriginalImage: ->
    return unless fs.existsSync("#{@dstDir}/#{@filename}#{@ext}")
    fs.unlink("#{@dstDir}/#{@filename}#{@ext}")

  # TODO: サイズの大きい方向に合わせてリサイズする。(今はwidth固定)
  resize: (width) ->
    return new Promise (resolve, reject) =>
      options =
        srcPath: path.resolve("#{@srcDir}/#{@srcFilename}")
        dstPath: path.resolve("#{@dstDir}/#{@filename}_w#{width}#{@ext}")
        format: @ext.replace('.', '')
        width: width
        customArgs: ['-define', "jpeg:size=#{width}x30"] # http://blog.mirakui.com/entry/20110123/1295795409
      im.resize options
      , (err, stdout) =>
        if err then return reject err
        return resolve "#{@filename}_w#{width}#{@ext}"

  write: ->
    return new Promise (resolve, reject) =>
      ws = fs.createWriteStream("#{@dstDir}/#{@filename}#{@ext}")
      request(@url).pipe(ws)
      ws.on 'finish', => return resolve "#{@filename}#{@ext}"
      ws.on 'error', (err) ->
        ws.end()
        return reject err