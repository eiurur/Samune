Samune
======

[![Build Status](https://travis-ci.org/eiurur/Samune.svg?branch=master)](https://travis-ci.org/eiurur/Samune)
[![Code Climate](https://codeclimate.com/github/eiurur/Samune/badges/gpa.svg)](https://codeclimate.com/github/eiurur/Samune)

Generator of thumbnails from URL.

# Dependencies

- ImageMagicK

# Installation

    npm i samune -S

# Usage

### generate

**URL**

    const Samune = require('samune');

    const opts = {
      url: 'https://41.media.tumblr.com/c6c0457f2c6886fc31099b590558c795/tumblr_nw0d6oxTtZ1s21xzoo2_1280.jpg',
      filename: 'test', /* any */
      dstDir: '/path/to/thumbnails_dir',
      canCleanupOriginalImage: false, /* any */
    }
    const samune = new Samune(opts);
    samune.generate([30, 120, 240, 480])
    .then( thuimbnailFilenameList => console.log(thuimbnailFilenameList) );

**Filepath**

    const Samune = require('samune');

    const opts = {
      url: '/path/to/test.jpg',
      filename: 'test', /* any */
      dstDir: '/path/to/thumbnails_dir',
      canCleanupOriginalImage: false, /* any */
    }
    const samune = new Samune(opts);
    samune.generate([480]);
    .then( thuimbnailFilenameList => console.log(thuimbnailFilenameList) );

### identify

if URL then

    const Samune = require('samune');

    const opts = {
      url: '/path/to/test.jpg',
      filename: 'test',
      dstDir: '/path/to/thumbnails_dir',
    }
    const samune = new Samune(opts);
    samune.identify()
    .then( features => console.log(features) );
    // =>
    { format: 'JPEG',
      class: 'DirectClass',
      geometry: '718x718+0+0',
      resolution: '72x72',
      'print size': '9.97222x9.97222',
      units: 'PixelsPerInch',
      type: 'TrueColor',
      endianess: 'Undefined',
      colorspace: 'sRGB',
      depth: 8,
      'channel depth': { red: '8-bit', green: '8-bit', blue: '8-bit' },
      'channel statistics':
       { red:
          { min: '0 (0)',
            max: '255 (1)',
            mean: '223.522 (0.876558)',
            'standard deviation': '54.1661 (0.212416)',
            kurtosis: '3.10199',
            skewness: '-2.02609' },
         green:
          { min: '32 (0.12549)',
            max: '255 (1)',
            mean: '195.547 (0.766852)',
            'standard deviation': '59.1709 (0.232043)',
            kurtosis: '-0.556918',
            skewness: '-0.949511' },
         blue:
          { min: '2 (0.00784314)',
            max: '255 (1)',
            mean: '158.734 (0.622485)',
            'standard deviation': '60.4351 (0.237)',
            kurtosis: '-1.11743',
            skewness: '-0.374164' } },
      'image statistics':
       { overall:
          { min: '0 (0)',
            max: '255 (1)',
            mean: '192.601 (0.755298)',
            'standard deviation': '57.9873 (0.227401)',
            kurtosis: '0.567644',
            skewness: '-1.15997' } },
      'rendering intent': 'Perceptual',
      gamma: '0.454545',
      chromaticity:
       { 'red primary': '(0.64,0.33)',
         'green primary': '(0.3,0.6)',
         'blue primary': '(0.15,0.06)',
         'white point': '(0.3127,0.329)' },
      interlace: 'None',
      'background color': 'white',
      'border color': 'srgb(223,223,223)',
      'matte color': 'grey74',
      'transparent color': 'black',
      compose: 'Over',
      'page geometry': '718x718+0+0',
      dispose: 'Undefined',
      iterations: '0',
      compression: 'JPEG',
      quality: 0.87,
      orientation: 'Undefined',
      tainted: 'False',
      filesize: '75KB',
      'number pixels': '516K',
      'pixels per second': '8.592MB',
      'user time': '0.060u',
      'elapsed time': '0:01.060',
      version: 'ImageMagick 6.7.7-10 2014-03-08 Q16 http://www.imagemagick.org',
      width: 718,
      height: 718 }
