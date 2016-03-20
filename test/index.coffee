fs     = require 'fs'
_      = require 'lodash'
path   = require 'path'
assert = require 'power-assert'
Samune = require path.join '..', 'build'

THUMBNAIL_DIR        = './thumbnails'
IMAGES_THUMBNAIL_DIR = './images/thumbnails'

JPG_URL_LIST = [
  'https://41.media.tumblr.com/c6c0457f2c6886fc31099b590558c795/tumblr_nw0d6oxTtZ1s21xzoo2_1280.jpg'
  'http://40.media.tumblr.com/6f8c17e057df703c5aad256b9d1524ff/tumblr_n7tyjjGIyN1qzvtljo1_1280.jpg'
]
GIF_URL = 'https://49.media.tumblr.com/6179526c67d94cdba1d1f0f2b4a19f82/tumblr_nwqf0mSPsq1u86t2qo1_540.gif'
JPG_PATH = './images_test/syaro.jpg'

describe 'Samune', ->

  it 'should generate jpg file when pass jpg path', ->
    opts =
      url: JPG_PATH
      dstDir: THUMBNAIL_DIR
    samune = new Samune(opts)
    samune.generate([30, 120])
    .then (thuimbnailFilenameList) ->
      assert _.isArray thuimbnailFilenameList
      assert thuimbnailFilenameList.length is 2

  it 'should generate jpg file when pass jpg path', ->
    opts =
      url: JPG_PATH
      filename: 'test_syaro'
      dstDir: THUMBNAIL_DIR
    samune = new Samune(opts)
    samune.generate([30, 120])
    .then (thuimbnailFilenameList) ->
      assert fs.existsSync("#{THUMBNAIL_DIR}/test_syaro_w120.jpg")
      assert _.isArray thuimbnailFilenameList
      assert thuimbnailFilenameList.length is 2

  it 'should generate jpg file when pass jpg url', ->
    opts =
      url: JPG_URL_LIST[0]
      dstDir: THUMBNAIL_DIR
    samune = new Samune(opts)
    samune.generate([30, 120, 480])
    .then (thuimbnailFilenameList) ->
      assert _.isArray thuimbnailFilenameList
      assert thuimbnailFilenameList.length is 3

  it 'should generate gif file when pass gif url', ->
    opts =
      url: GIF_URL
      dstDir: THUMBNAIL_DIR
    samune = new Samune(opts)
    samune.generate([120])
    .then (thuimbnailFilenameList) ->
      assert _.isArray thuimbnailFilenameList
      assert thuimbnailFilenameList.length is 1

  it 'should generate test_w#{size}.jpg when pass filename with the name test', ->
    opts =
      url: JPG_URL_LIST[1]
      filename: 'test'
      dstDir: THUMBNAIL_DIR
    samune = new Samune(opts)
    samune.generate([30, 120, 240, 480])
    .then (thuimbnailFilenameList) ->
      assert _.isArray thuimbnailFilenameList
      assert thuimbnailFilenameList.length is 4
      assert thuimbnailFilenameList[1] is 'test_w120.jpg'

  it 'should generate jpg file in the /images/thumbnails/', ->
    opts =
      url: JPG_URL_LIST[1]
      dstDir: IMAGES_THUMBNAIL_DIR
    samune = new Samune(opts)
    samune.generate([30, 120, 240, 480])
    .then (thuimbnailFilenameList) ->
      assert _.isArray thuimbnailFilenameList
      assert thuimbnailFilenameList.length is 4

  it 'should generate single jpg file when pass single size to generate()', ->
    opts =
      url: JPG_URL_LIST[1]
      dstDir: THUMBNAIL_DIR
    samune = new Samune(opts)
    samune.generate(30)
    .then (thuimbnailFilenameList) ->
      assert _.isArray thuimbnailFilenameList
      assert thuimbnailFilenameList.length is 1

  it 'should done remove original image when pass canCleanupOriginal to true', ->
    opts =
      url: JPG_URL_LIST[1]
      filename: 'cocochino'
      dstDir: THUMBNAIL_DIR
      canCleanupOriginalImage: false
    samune = new Samune(opts)
    samune.generate(30)
    .then (thuimbnailFilenameList) ->
      assert fs.existsSync("#{THUMBNAIL_DIR}/cocochino.jpg")
      assert _.isArray thuimbnailFilenameList
      assert thuimbnailFilenameList.length is 1

  it 'should return [] when pass invliad url', ->
    opts =
      url: 'invalidurl'
      dstDir: THUMBNAIL_DIR
    samune = new Samune(opts)
    samune.generate(30)
    .catch (err) ->
      assert _.isError err

  it 'should return err when dont pass dstDir', ->
    opts =
      url: JPG_URL_LIST[1]
    samune = new Samune(opts)
    samune.generate(30)
    .catch (err) ->
      assert _.isError err
      assert err.message is 'dstDir is invalid'

  it 'should return err when pass NaN to generate()', ->
    opts =
      url: JPG_URL_LIST[1]
      dstDir: THUMBNAIL_DIR
    samune = new Samune(opts)
    samune.generate('a')
    .catch (err) ->
      assert _.isError err
      assert err.message is 'sizes include NaN'

  it 'should return err when pass empty to generate()', ->
    opts =
      url: JPG_URL_LIST[1]
      dstDir: THUMBNAIL_DIR
    samune = new Samune(opts)
    samune.generate()
    .catch (err) ->
      assert _.isError err
      assert err.message is 'sizes is empty'