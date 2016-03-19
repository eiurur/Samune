Samune
======

Generator of thumbnails from URL.

# Dependencies

- ImageMagicK

# Installation

    npm i samune -S

# Usage

    const Samune = require('samune');

    const opts = {
      url: 'https://41.media.tumblr.com/c6c0457f2c6886fc31099b590558c795/tumblr_nw0d6oxTtZ1s21xzoo2_1280.jpg',
      filename: 'test', /* any */
      dstDir: '/path/to/thumbnails_dir',
      canCleanupOriginalImage: false, /* any */
    }
    const samune = new Samune(opts);
    samune.generate([30, 120, 240, 480]);
