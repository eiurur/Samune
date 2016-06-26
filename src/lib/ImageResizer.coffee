fs               = require 'fs'
im               = require 'imagemagick'
path             = require 'path'
request          = require 'request'
DirectoryManager = require './DirectoryManager'


module.exports = class ImageResizer

  constructor: (@url, @filename, @dstDir, @canCleanupOriginalImage = true) ->
    @originalFilename = @url.split('/').pop()
    @ext = path.extname(@originalFilename) or '.jpg'

  generateDestinationDirectory: ->
    return new Promise (resolve, reject) =>
      return reject 'dstDir is invalid' if !@dstDir
      return resolve DirectoryManager.generateSync(@dstDir)

  cleanupOriginalImage: ->
    return unless DirectoryManager.existsSync "#{@dstDir}/#{@filename}#{@ext}"
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
