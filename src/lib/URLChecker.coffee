request = require 'request'

module.exports = class URLChecker

  @isURL: (url) ->
    url_pattern = /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\\,%#]+)$/
    return url_pattern.test url

  @isValidURL: (url) ->
    return new Promise (resolve, reject) ->
      request.get(url)
      .on 'response', (response) ->
        unless response.statusCode is 200 then return reject 'image url is invalid'
        return resolve true
      .on 'error', (err) ->
        return reject err

  @getFilesizeBite: (url) ->
    return new Promise (resolve, reject) ->
      request.get(url)
      .on 'response', (response) ->
        unless response.statusCode is 200 then return reject 'image url is invalid'
        return resolve response.headers['content-length']
      .on 'error', (err) ->
        return reject err
