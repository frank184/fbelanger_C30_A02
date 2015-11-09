// Native Modules
var URL = require('url');
var path = require('path');
var fs = require('fs');

// Custom Modules
var handler = require('./handler');
var error = require('./error');
var log = require('./log');

// Paths
var public_folder = path.join(__dirname, "public");

// Defining no extension because this will be our Restful API
// The Restful API will utilize views and jade templates
var extensions = [];
var routes = {};

module.exports = {
  extensions: function(exts) {
    for (ext in exts)
      extensions.push(exts[ext]);
  },
  routes: function() {

  },
  set: function(url, callback) {
    if (!url) throw new Error("This method requires a url param");
    if (!callback) throw new Error("This method requires a callback");
    routes[url] = handler.create(callback);
  },
  get: function(request) {
    var url = request.url;
    var dir = path.dirname(url);
    var file = path.basename(url);
    var ext = path.extname(url);
    var url = URL.parse(path.join(dir, file));
    log.debug(
      "URL:", url,
      "PATH_TO_FILE", path_to_file,
      "ROUTES:", routes,
      "EXTENSIONS:", extensions,
      "DIR:", dir,
      "FILE:", file,
      "EXT:", ext,
      "SUPP EXT:", extensions.indexOf(ext) != -1
    );

    if (extensions.indexOf(ext) != -1) {
      var path_to_file = path.join(__dirname, "..", "public", url.pathname);
      log.log(" [+] " + request.method + " " + path_to_file + " for " + request.connection.remoteAddress);
      return handler.create(function(request, response) {
        fs.exists(path_to_file, function(exists) {
          if (!exists)
            return handler.create(function(request, response) {
              error(404, path_to_file, request, response);
            });
          else
            fs.readFile(path_to_file, function(err, data) {
              if (err) throw err;
              response.end(data);
            });
        });
      });
    } else {
      if (ext == "") {
        return routes[url.pathname];
      } else {
        return handler.create(function(request, response) {
          error(406, path_to_file, request, response);
        });
      }
    }
  }
}
