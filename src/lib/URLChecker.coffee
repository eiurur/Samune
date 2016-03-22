module.exports = class URLChecker

  @isURL: (url) ->
    url_pattern = /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\\,%#]+)$/
    return url_pattern.test url
