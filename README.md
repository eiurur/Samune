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

**URL**

    const Samune = require('samune');

    const opts = {
      url: 'https://41.media.tumblr.com/c6c0457f2c6886fc31099b590558c795/tumblr_nw0d6oxTtZ1s21xzoo2_1280.jpg',
      filename: 'test', /* any */
      dstDir: '/path/to/thumbnails_dir',
      canCleanupOriginalImage: false, /* any */
    }
    const samune = new Samune(opts);
    samune.generate([30, 120, 240, 480]);

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