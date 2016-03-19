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
    @filename = (@filename or randomstring.generate())

  exec: (sizes) ->
    return new Promise (resolve, reject) =>
      # todo: これってここ？
      throw new Error 'dstDir is invalid' if !@dstDir

      @generateDir()
      @write()
      .then (filename) =>
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
        srcPath: path.resolve("#{@dstDir}/#{@filename}#{@ext}")
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