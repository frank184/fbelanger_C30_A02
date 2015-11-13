// Native Modules
var URL = require('url');
var path = require('path');
var fs = require('fs');

// Custom Modules
var handler = require('./handler');
var error = require('./error');
var log = require('./log');

// Paths
var public_folder = path.join(__dirname, "..", "public");

// Defining no extension because this will be our Restful API
// The Restful API will utilize views written in jade templates
var extensions = [];
var routes = {};

module.exports = {
  routes: routes,
  extensions: function(exts) {
    for (arg in arguments) {
      if (arguments[arg].constructor != String)
        throw new Error("This method requires multiple String parameters.")
      else
        extensions.push(arguments[arg]);
      }
  },
  set: function(method, url, callback) {
    if (!method) throw new Error("This method requires a request method parameter.")
    if (!url) throw new Error("This method requires a url parameter.");
    if (!callback) throw new Error("This method requires a callback parameter.");
    routes[url] = handler.create(method, callback);
  },
  get: function(request) {
    var url = request.url;
    var dir = path.dirname(url);
    var file = path.basename(url);
    var ext = path.extname(url);
    var url = URL.parse(request.url);
    var urlArr = url.pathname.split("/");
    // default to files from public,
    var path_to_file = path.join(public_folder, url.pathname);
    log.debug(
      "URL:", url,
      "URLARRAY:", urlArr,
      "ROUTES:", routes,
      "EXTENSIONS:", extensions,
      "DIR:", dir,
      "FILE:", file,
      "EXT:", ext,
      "SUPP EXT:", extensions.indexOf(ext) != -1
    );
    if (ext == "") {  // This is the Restful Section to be
      route = routes[url.pathname]; // This needs to change
        if (request.method == route.method)
          return route.callback;
        else handler.create("GET", function(request, response) {
          error(405, path_to_file, request, response);
        });
    } else if (extensions.indexOf(ext) != -1) {
      return handler.create("GET", function(request, response) {
        log.log(" [+] " + request.method + " " + url.pathname + " => " + path_to_file + " from " + request.connection.remoteAddress);
        fs.exists(path_to_file, function(exists) {
          if (!exists) error(404, path_to_file, request, response);
          else fs.readFile(path_to_file, function(err, data) {
              if (err) error(500, path_to_file, request, response);
              else response.end(data);
            });
        });
      });
    } else {
      return handler.create("GET", function(request, response) {
        error(406, path_to_file, request, response);
      });
    }
  }
}
