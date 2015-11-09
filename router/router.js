// Native Modules
var parser = require('url');
var path = require('path');
var fs = require('fs');

// Custom Modules
var handler = require('./handler');
var errors = require('./errors');
var log = require('./log');

// Paths
var public_folder = path.join(__dirname, "public");

var routes = {};
var extensions = [];

module.exports = {
  routes: routes,
  extensions: extensions,
  set: function(url, callback) {
    if (!url) throw new Error("This method requires a url param");
    if (!callback) throw new Error("This method requires a callback");
    routes[url] = handler.create(callback);
  },
  get: function(request) {
    var url = parser.parse(request.url, true);
    var dir = path.dirname(url.pathname);
    var file = path.basename(url.pathname);
    var ext = path.extname(file);

    log.debug("URL:", url, "DIR:", dir, "FILE:", file, "EXT:", ext);

    if (extensions.indexOf(ext) != -1) {
      return handler.create(function(request, response) {

      });
    } else {
      return handler.create(errors(406));
    }
  }
}
