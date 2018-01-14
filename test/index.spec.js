const fs = require('fs');
const _ = require('lodash');
const path = require('path');
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
const JPG_PATH = './test/images/syaro.jpg';
const HEAVY_PNG_PATH = './test/images/6MBover.png';

/*
  URL TEST
  */
test('should generate jpg file when pass jpg url', (t) => {
  const opts = {
    url: JPG_URL_LIST[0],
    dstDir: THUMBNAIL_DIR,
  };
  const samune = new Samune(opts);
  samune.generate([30, 120, 480]).then((thuimbnailFilenameList) => {
    t.true(Array.isArray(thuimbnailFilenameList));
    t.true(thuimbnailFilenameList.length === 3);
    t.true(thuimbnailFilenameList[1].filename === 'tumblr_op2hxiLMta1qbgq3so1_1280_w120.jpg');

  });
});

test('should generate test_w#{size}.jpg when pass filename with the name test', (t) => {
  const opts = {
    url: JPG_URL_LIST[1],
    filename: 'test',
    dstDir: THUMBNAIL_DIR,
  };
  const samune = new Samune(opts);
  samune.generate([30, 120, 240, 480]).then((thuimbnailFilenameList) => {
    t.true(Array.isArray(thuimbnailFilenameList));
    t.true(thuimbnailFilenameList.length === 4);
    t.true(thuimbnailFilenameList[1].filename === 'test_w120.jpg');
  });
});

test('should generate test_w#{size}.jpg when pass filename and imageMagickCustomArgs with the name test', (t) => {
  const opts = {
    url: JPG_URL_LIST[1],
    filename: 'test2',
    dstDir: THUMBNAIL_DIR,
    imageMagickCustomArgs: ["-define", `jpeg:size=120x30`]
  };
  const samune = new Samune(opts);
  samune.generate([30, 120, 240, 480]).then((thuimbnailFilenameList) => {
    t.true(Array.isArray(thuimbnailFilenameList));
    t.true(thuimbnailFilenameList.length === 4);
    t.true(thuimbnailFilenameList[2].filename === 'test2_w240.jpg');
  });
});

test('should generate gif file when pass gif url', (t) => {
  const opts = {
    url: GIF_URL,
    dstDir: THUMBNAIL_DIR,
  };
  const samune = new Samune(opts);
  samune.generate([120]).then((thuimbnailFilenameList) => {
    t.true(Array.isArray(thuimbnailFilenameList));
    t.true(thuimbnailFilenameList.length === 1);
  });
});


test('should generate jpg file when pass jpg path', (t) => {
  let opts = {
    url: JPG_PATH,
    dstDir: THUMBNAIL_DIR,
  };
  let samune = new Samune(opts);
  samune.generate([30, 120, 240, 480]).then((thuimbnailFilenameList) => {
    t.true(Array.isArray(thuimbnailFilenameList));
    t.true(fs.existsSync(`${THUMBNAIL_DIR}/syaro_w120.jpg`));
    t.true(thuimbnailFilenameList[1].filename === 'syaro_w120.jpg');
  });
});

test('should generate jpg file when pass jpg path and filename', (t) => {
  let opts = {
    url: JPG_PATH,
    filename: 'test_syaro',
    dstDir: THUMBNAIL_DIR,
  };
  let samune = new Samune(opts);
  samune.generate([30, 120]).then((thuimbnailFilenameList) => {
    t.true(Array.isArray(thuimbnailFilenameList));
    t.true(fs.existsSync(`${THUMBNAIL_DIR}/test_syaro_w120.jpg`));
    t.true(thuimbnailFilenameList.length === 2);
    t.true(thuimbnailFilenameList[1].filename === 'test_syaro_w120.jpg');
  });
});



test('should generate heavy png files in the /images/thumbnails/', (t) => {
  let opts = {
    url: HEAVY_PNG_PATH,
    filename: '6MBover',
    dstDir: THUMBNAIL_DIR,
  };
  let samune = new Samune(opts);
  samune.generate([30, 120, 240, 480]).then((thuimbnailFilenameList) => {
    t.true(Array.isArray(thuimbnailFilenameList));
    t.true(fs.existsSync(`${THUMBNAIL_DIR}/6MBover_w480.png`));
    t.true(thuimbnailFilenameList.length === 4);
    t.true(thuimbnailFilenameList[3].filename === '6MBover_w480.png');
  });
});


/*
Failure TEST
*/
// test('should return Error when pass invliad image path', (t) => {
//   let opts = {
//     url: 'invalid',
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   samune.generate([30]).then().catch((err) => {
//     t.is(err instanceof Error)
//   });
// });

// 以下、TODO

// it('should return Error when pass invliad image path', () => {
//   let opts = {
//     url: 'invalid',
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   samune.generate(30)
//     .catch((err) => {
//       return assert(_.isError(err));
//     });
// });

// it('should return Error when pass invliad url', () => {
//   let opts = {
//     url: 'http://invalidurl',
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   samune.generate(30)
//     .catch((err) => {
//       return assert(_.isError(err));
//     });
// });

// it('should return err when dont pass dstDir', () => {
//   let opts =
//     { url: JPG_URL_LIST[1] };
//   let samune = new Samune(opts);
//   samune.generate(30)
//     .catch((err) => {
//       assert(_.isError(err));
//       return assert(err.message === 'dstDir is invalid');
//     });
// });

// it('should return err when pass NaN to generate()', () => {
//   let opts = {
//     url: JPG_URL_LIST[1],
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   samune.generate('a')
//     .catch((err) => {
//       assert(_.isError(err));
//       return assert(err.message === 'sizes include NaN');
//     });
// });

// it('should return err when pass empty to generate()', () => {
//   let opts = {
//     url: JPG_URL_LIST[1],
//     dstDir: THUMBNAIL_DIR,
//   };
//   let samune = new Samune(opts);
//   samune.generate()
//     .catch((err) => {
//       assert(_.isError(err));
//       return assert(err.message === 'sizes is empty');
//     });
// });
