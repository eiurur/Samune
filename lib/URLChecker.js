const request = require('request');

module.exports = class URLChecker {

  static isURL(url) {
    const url_pattern = /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\\,%#]+)$/;
    return url_pattern.test(url);
  }

  static isValidURL(url) {
    return new Promise((resolve, reject) => {
      return request.get(url)
        .on('response', (response) => {
          if (response.statusCode !== 200) { return reject('[Samune] image url is invalid'); }
          return resolve(true);
        }).on('error', (err) => {
          return reject(err);
        });
    });
  }

  static getFileSizeByte(url) {
    return new Promise((resolve, reject) => {
      return request.get(url)
        .on('response', (response) => {
          if (response.statusCode !== 200) { return reject('[Samune] image url is invalid'); }
          return resolve(response.headers['content-length']);
        })
        .on('error', (err) => {
          return reject(err);
        });
    });
  }
};
