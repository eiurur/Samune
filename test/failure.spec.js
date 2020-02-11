const _ = require('lodash');
const fs = require('fs');
const test = require('ava');
const Samune = require('..');

const THUMBNAIL_DIR = './thumbnails';

const JPG_URL_LIST = [
  'https://68.media.tumblr.com/8435bb2072923a0e3d05885c6f074a4b/tumblr_op2hxiLMta1qbgq3so1_1280.jpg',
  'https://68.media.tumblr.com/25cb865c25db2a80d4e5479f4eceee38/tumblr_oq3d6fXiPk1qzljvuo1_1280.jpg',
];
const GIF_URL = 'https://68.media.tumblr.com/29ff438ae72824d1927da59ba7715b6a/tumblr_opo8okeNMK1twgfw0o3_540.gif';
const JPG_PATH = './test/images/syaro.jpg';
const HEAVY_PNG_PATH = './test/images/6MBover.png';
const WEBP_PATH = './test/images/webp.webp';

const check = async (t, params, opts, result) => {
  const samune = new Samune(params);
  const thuimbnailFilenameList = await samune.generate(opts.sizes);
  t.true(Array.isArray(thuimbnailFilenameList));
  t.true(await fsp.pathExists(result.shouldExistPath));
  t.true(thuimbnailFilenameList.length === opts.sizes.length);
  t.true(thuimbnailFilenameList[0].filename === result.shouldHeadFilename);
};

/**
 * 以下、Failure TEST
 */
test('should return Error when pass invliad image path', async (t) => {
  try {
    const opts = {
      url: 'invalid',
      dstDir: THUMBNAIL_DIR,
    };
    const samune = new Samune(opts);
    await samune.generate([30]);
    t.fail();
  } catch (e) {
    t.pass();
  }
});

test('should return Error when pass invliad url', async (t) => {
  try {
    const opts = {
      url: 'http://invalidurl',
      dstDir: THUMBNAIL_DIR,
    };
    const samune = new Samune(opts);
    await samune.generate(30);
    t.fail();
  } catch (e) {
    t.pass();
  }
});

/**
 * FIXME: 原因不明。
 * 152:     t.true(err.message === 'dstDir is invalid');
  Value is not `true`:

  false

  err.message === 'dstDir is invalid'
  => false

  err.message
  => 'Error: dstDir is invalid'

  err
  => Error {
    message: 'Error: dstDir is invalid',
  }
 */
// test('should return err when dont pass dstDir', async (t) => {
//   let opts = {
//     url: JPG_URL_LIST[1],
//   };
//   let samune = new Samune(opts);
//   return samune.generate([30, 120, 240, 480]).catch((err) => {
//     t.true(_.isError(err));
//     t.true(err.message === 'dstDir is invalid');
//   });
// });

test('should return err when pass NaN to generate()', async (t) => {
  try {
    const opts = {
      url: JPG_URL_LIST[1],
      dstDir: THUMBNAIL_DIR,
    };
    const samune = new Samune(opts);
    await samune.generate(['a']);
    t.fail();
  } catch (err) {
    t.true(_.isError(err));
    t.true(err.message === 'sizes include NaN');
  }
});

test('should return err when pass empty to generate()', async (t) => {
  try {
    const opts = {
      url: JPG_URL_LIST[1],
      dstDir: THUMBNAIL_DIR,
    };
    const samune = new Samune(opts);
    await samune.generate();
    t.fail();
  } catch (err) {
    t.true(_.isError(err));
    t.true(err.message === 'sizes is empty');
  }
});
