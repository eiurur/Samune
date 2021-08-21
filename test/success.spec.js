const fsp = require('fs-extra');
const test = require('ava');
const Samune = require('..');

const THUMBNAIL_DIR = './thumbnails';

const JPG_URL_LIST = [
  'https://64.media.tumblr.com/8435bb2072923a0e3d05885c6f074a4b/tumblr_op2hxiLMta1qbgq3so1_1280.jpg',
  'https://64.media.tumblr.com/25cb865c25db2a80d4e5479f4eceee38/tumblr_oq3d6fXiPk1qzljvuo1_1280.jpg',
];
const GIF_URL =
  'https://64.media.tumblr.com/29ff438ae72824d1927da59ba7715b6a/tumblr_opo8okeNMK1twgfw0o3_540.gif';
const JPG_PATH = './test/images/syaro.jpg';
const HEAVY_PNG_PATH = './test/images/6MBover.png';
const WEBP_PATH = './test/images/webp.webp';
const AVIF_PATH = './test/images/avif.avif';
const GIF_PATH = './test/images/test.gif';

const check = async (t, params, opts, result) => {
  const samune = new Samune(params);
  try {
    const thuimbnailFilenameList = await samune.generate(opts.sizes);
    t.true(Array.isArray(thuimbnailFilenameList));
    t.true(await fsp.pathExists(result.shouldExistPath));
    t.true(thuimbnailFilenameList.length === opts.sizes.length);
    t.true(thuimbnailFilenameList[0].filename === result.shouldHeadFilename);
  } catch (e) {
    console.error(e);
    t.fail();
  }
};

test.before((t) => {
  fsp.rmdirSync(THUMBNAIL_DIR, { recursive: true });
});

/*
  URL TEST
  */
test('should generate jpg file when pass jpg url', async (t) => {
  const params = {
    url: JPG_URL_LIST[0],
    dstDir: THUMBNAIL_DIR,
  };
  const opts = {
    sizes: [30, 120, 480],
  };
  const result = {
    shouldExistPath: `${THUMBNAIL_DIR}/tumblr_op2hxiLMta1qbgq3so1_1280_w30.jpg`,
    shouldHeadFilename: 'tumblr_op2hxiLMta1qbgq3so1_1280_w30.jpg',
  };
  await check(t, params, opts, result);
});

test('should generate test_w#{size}.jpg when pass filename with the name test', async (t) => {
  const params = {
    url: JPG_URL_LIST[1],
    filename: 'test',
    dstDir: THUMBNAIL_DIR,
  };
  const opts = {
    sizes: [30, 120, 240, 480],
  };
  const result = {
    shouldExistPath: `${THUMBNAIL_DIR}/test_w30.jpg`,
    shouldHeadFilename: 'test_w30.jpg',
  };
  await check(t, params, opts, result);
});

test('should generate test_w#{size}.jpg when pass filename and resizeOptions with the name test', async (t) => {
  const params = {
    url: JPG_URL_LIST[1],
    filename: 'test2',
    dstDir: THUMBNAIL_DIR,
    resizeOptions: { quality: 75 },
  };
  const opts = {
    sizes: [30, 120, 240, 480],
  };
  const result = {
    shouldExistPath: `${THUMBNAIL_DIR}/test2_w30.jpg`,
    shouldHeadFilename: 'test2_w30.jpg',
  };
  await check(t, params, opts, result);
});

test('should generate gif file when pass gif url', async (t) => {
  const params = {
    url: GIF_URL,
    dstDir: THUMBNAIL_DIR,
  };
  const opts = {
    sizes: [120],
  };
  const result = {
    shouldExistPath: `${THUMBNAIL_DIR}/tumblr_opo8okeNMK1twgfw0o3_540_w120.gif`,
    shouldHeadFilename: 'tumblr_opo8okeNMK1twgfw0o3_540_w120.gif',
  };
  await check(t, params, opts, result);
});

test('should generate jpg file when pass jpg path', async (t) => {
  const params = {
    url: JPG_PATH,
    dstDir: THUMBNAIL_DIR,
  };
  const opts = {
    sizes: [30, 120, 240, 480],
  };
  const result = {
    shouldExistPath: `${THUMBNAIL_DIR}/syaro_w30.jpg`,
    shouldHeadFilename: 'syaro_w30.jpg',
  };
  await check(t, params, opts, result);
});

test('should generate jpg file when pass jpg path and filename', async (t) => {
  const params = {
    url: JPG_PATH,
    filename: 'test_syaro',
    dstDir: THUMBNAIL_DIR,
  };
  const opts = {
    sizes: [30, 120],
  };
  const result = {
    shouldExistPath: `${THUMBNAIL_DIR}/test_syaro_w30.jpg`,
    shouldHeadFilename: 'test_syaro_w30.jpg',
  };
  await check(t, params, opts, result);
});

test('should generate heavy png files in the /images/thumbnails/', async (t) => {
  const params = {
    url: HEAVY_PNG_PATH,
    filename: '6MBover',
    dstDir: THUMBNAIL_DIR,
  };
  const opts = {
    sizes: [30, 120, 240, 480],
  };
  const result = {
    shouldExistPath: `${THUMBNAIL_DIR}/6MBover_w30.png`,
    shouldHeadFilename: '6MBover_w30.png',
  };
  await check(t, params, opts, result);
});

test('should generate webp files in the /images/thumbnails/', async (t) => {
  const params = {
    url: WEBP_PATH,
    filename: 'output',
    dstDir: THUMBNAIL_DIR,
  };
  const opts = {
    sizes: [30, 120, 240, 480],
  };
  const result = {
    shouldExistPath: `${THUMBNAIL_DIR}/output_w480.webp`,
    shouldHeadFilename: 'output_w30.webp',
  };
  await check(t, params, opts, result);
});

test('should generate avif files in the /images/thumbnails/', async (t) => {
  const params = {
    url: AVIF_PATH,
    filename: 'output',
    dstDir: THUMBNAIL_DIR,
  };
  const opts = {
    sizes: [30, 120, 240, 480],
  };
  const result = {
    shouldExistPath: `${THUMBNAIL_DIR}/output_w480.avif`,
    shouldHeadFilename: 'output_w30.avif',
  };
  await check(t, params, opts, result);
});

test('should generate gif files in the /images/thumbnails/', async (t) => {
  const params = {
    url: GIF_PATH,
    filename: 'output',
    dstDir: THUMBNAIL_DIR,
  };
  const opts = {
    sizes: [30, 120, 240, 480],
  };
  const result = {
    shouldExistPath: `${THUMBNAIL_DIR}/output_w480.gif`,
    shouldHeadFilename: 'output_w30.gif',
  };
  await check(t, params, opts, result);
});
