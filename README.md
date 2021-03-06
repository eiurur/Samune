# Samune

[![Build Status](https://travis-ci.com/eiurur/Samune.svg?branch=master)](https://travis-ci.com/eiurur/Samune)
[![Code Climate](https://codeclimate.com/github/eiurur/Samune/badges/gpa.svg)](https://codeclimate.com/github/eiurur/Samune)

Generator of thumbnails from URL.

# Installation

    npm i samune -S

# Usage

### generate

**URL**

    const Samune = require('samune');

    const opts = {
      url: 'https://41.media.tumblr.com/c6c0457f2c6886fc31099b590558c795/tumblr_nw0d6oxTtZ1s21xzoo2_1280.jpg',
      filename: 'test', /* optional */
      dstDir: '/path/to/thumbnails_dir',
    }
    const samune = new Samune(opts);
    samune.generate([30, 120, 240, 480])
    .then( thuimbnailFilenameList => console.log(thuimbnailFilenameList) );

    =>  [
          { width: 30,
            filename: 'test_w30.jpg',
            path: 'D:/path/to/thumbnails_dir/test_w30.jpg' },
          { width: 120,
            filename: 'test_w120.jpg',
            path: 'D:/path/to/thumbnails_dir/test_w120.jpg' },
          { width: 240,
            filename: 'test_w240.jpg',
            path: 'D:/path/to/thumbnails_dir/test_w240.jpg' },
          { width: 480,
            filename: 'test_w480.jpg',
            path: 'D:/path/to/thumbnails_dir/test_w480.jpg' }
        ]

**Filepath**

    const Samune = require('samune');

    const opts = {
      url: '/path/to/test.jpg',
      filename: 'test', /* optional */
      dstDir: '/path/to/thumbnails_dir',
    }
    const samune = new Samune(opts);
    samune.generate([480]);
    .then( thuimbnailFilenameList => console.log(thuimbnailFilenameList) );

    =>  [
          { width: 480,
            filename: 'test_w480.jpg',
            path: 'D:/path/to/thumbnails_dir/test_w480.jpg' }
        ]

# TODO

- [ ] hash to naming
