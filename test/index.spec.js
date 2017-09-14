const fs = require('fs');
const _ = require('lodash');
const path = require('path');
// const assert = require('power-assert');
const test = require('ava');
const Samune = require('../');

const THUMBNAIL_DIR = './thumbnails';
const IMAGES_THUMBNAIL_DIR = './images/thumbnails';

const JPG_URL_LIST = [
  'https://68.media.tumblr.com/8435bb2072923a0e3d05885c6f074a4b/tumblr_op2hxiLMta1qbgq3so1_1280.jpg',
  'https://68.media.tumblr.com/25cb865c25db2a80d4e5479f4eceee38/tumblr_oq3d6fXiPk1qzljvuo1_1280.jpg',
];
const GIF_URL =
  'https://68.media.tumblr.com/29ff438ae72824d1927da59ba7715b6a/tumblr_opo8okeNMK1twgfw0o3_540.gif';
const JPG_PATH = './images_test/syaro.jpg';

/*
  URL TEST
  */
test('should generate jpg file when pass jpg url', (t) => {
  const opts = {
    url: JPG_URL_LIST[0],
    dstDir: THUMBNAIL_DIR,
  };
  const samune = new Samune(opts);
  return samune.generate([30, 120, 480]).then((thuimbnailFilenameList) => {
    t.true(Array.isArray(thuimbnailFilenameList));
    t.true(thuimbnailFilenameList.length === 3);
  });
});

test('should generate test_w#{size}.jpg when pass filename with the name test', (t) => {
  const opts = {
    url: JPG_URL_LIST[1],
    filename: 'test',
    dstDir: THUMBNAIL_DIR,
  };
  const samune = new Samune(opts);
  return samune.generate([30, 120, 240, 480]).then((thuimbnailFilenameList) => {
    t.true(_.isArray(thuimbnailFilenameList));
    t.true(thuimbnailFilenameList.length === 4);
    t.true(thuimbnailFilenameList[1] === 'test_w120.jpg');
  });
});

test('should generate gif file when pass gif url', (t) => {
  const opts = {
    url: GIF_URL,
    dstDir: THUMBNAIL_DIR,
  };
  const samune = new Samune(opts);
  return samune.generate([120]).then((thuimbnailFilenameList) => {
    t.true(_.isArray(thuimbnailFilenameList));
    t.true(thuimbnailFilenameList.length === 1);
  });
});

// 以下、TODO

// it('should generate jpg file in the /images/thumbnails/', () => {
//   let opts = {
//     url: JPG_URL_LIST[1],
//     dstDir: IMAGES_THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.generate([30, 120, 240, 480])
//   .then((thuimbnailFilenameList) => {
//     assert(_.isArray(thuimbnailFilenameList));
//     return assert(thuimbnailFilenameList.length === 4);
//   });
// });

// it('should generate single jpg file when pass single size to generate()', () => {
//   let opts = {
//     url: JPG_URL_LIST[1],
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.generate(30)
//   .then((thuimbnailFilenameList) => {
//     assert(_.isArray(thuimbnailFilenameList));
//     return assert(thuimbnailFilenameList.length === 1);
//   });
// });

// it('should done remove original image when pass banCleanupOriginal to true', () => {
//   let opts = {
//     url: JPG_URL_LIST[1],
//     filename: 'cocochino',
//     dstDir: THUMBNAIL_DIR,
//     canCleanupOriginalImage: false,
//   };
//   let samune = new Samune(opts);
//   return samune.generate(30)
//   .then((thuimbnailFilenameList) => {
//     assert(fs.existsSync(`${THUMBNAIL_DIR}/cocochino.jpg`));
//     assert(_.isArray(thuimbnailFilenameList));
//     return assert(thuimbnailFilenameList.length === 1);
//   });
// });

// /*
// Filepath TEST
// */
// it('should generate jpg file when pass jpg path', () => {
//   let opts = {
//     url: JPG_PATH,
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.generate([30, 120])
//   .then((thuimbnailFilenameList) => {
//     assert(fs.existsSync(`${THUMBNAIL_DIR}/syaro_w120.jpg`));
//     assert(_.isArray(thuimbnailFilenameList));
//     return assert(thuimbnailFilenameList.length === 2);
//   });
// });

// it('should generate jpg file when pass jpg path and filename', () => {
//   let opts = {
//     url: JPG_PATH,
//     filename: 'test_syaro',
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.generate([30, 120])
//   .then((thuimbnailFilenameList) => {
//     assert(fs.existsSync(`${THUMBNAIL_DIR}/test_syaro_w120.jpg`));
//     assert(_.isArray(thuimbnailFilenameList));
//     return assert(thuimbnailFilenameList.length === 2);
//   });
// });

// // Identify
// it('should return image features when pass jpg path', () => {
//   let opts = {
//     url: JPG_PATH,
//     filename: 'test_syaro',
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.identify()
//   .then((features) => {
//     assert(_.isObject(features));
//     assert(_.isNumber(features.width));
//     assert(_.isNumber(features.height));
//     assert(_.isString(features.filesize));
//     return assert(features.format === 'JPEG');
//   });
// });

// it('should return image features when pass jpg url', () => {
//   let opts = {
//     url: JPG_URL_LIST[0],
//     filename: 'test_syaro_',
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.identify()
//   .then((features) => {
//     assert(_.isObject(features));
//     assert(_.isNumber(features.width));
//     assert(_.isNumber(features.height));
//     assert(_.isString(features.filesize));
//     return assert(features.format === 'JPEG');
//   });
// });

// /*
// Failure TEST
// */
// it('should return Error when pass invliad image path', () => {
//   let opts = {
//     url: 'invalid',
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.generate(30)
//   .catch((err) => {
//     return assert(_.isError(err));
//   });
// });

// it('should return Error when pass invliad url', () => {
//   let opts = {
//     url: 'http://invalidurl',
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.generate(30)
//   .catch((err) => {
//     return assert(_.isError(err));
//   });
// });

// it('should return err when dont pass dstDir', () => {
//   let opts =
//     { url: JPG_URL_LIST[1] };
//   let samune = new Samune(opts);
//   return samune.generate(30)
//   .catch((err) => {
//     assert(_.isError(err));
//     return assert(err.message === 'dstDir is invalid');
//   });
// });

// it('should return err when pass NaN to generate()', () => {
//   let opts = {
//     url: JPG_URL_LIST[1],
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.generate('a')
//   .catch((err) => {
//     assert(_.isError(err));
//     return assert(err.message === 'sizes include NaN');
//   });
// });

// it('should return err when pass empty to generate()', () => {
//   let opts = {
//     url: JPG_URL_LIST[1],
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.generate()
//   .catch((err) => {
//     assert(_.isError(err));
//     return assert(err.message === 'sizes is empty');
//   });
// });

// // Identify
// it('should return err when pass invalid image path', () => {
//   let opts = {
//     url: `${JPG_PATH  }_`,
//     filename: 'test_syaro',
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.identify()
//   .catch((err) => {
//     assert(_.isError(err));
//     return assert(err.message === 'image path is invalid');
//   });
// });

// return it('should return err when pass invalid image url', () => {
//   let opts = {
//     url: 'http://asda',
//     filename: 'test_syaro',
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   return samune.identify()
//   .catch((err) => {
//     assert(_.isError(err));
//     return assert(err.message === 'image url is invalid');
//   });
// });
