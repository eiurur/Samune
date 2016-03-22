fs     = require 'fs'
mkdirp = require 'mkdirp'

module.exports = class DirectoryManager

  @existsSync: (dir) ->
    fs.existsSync(dir)

  @generateSync: (dir) ->
    fs.existsSync(dir) or mkdirp.sync(dir)