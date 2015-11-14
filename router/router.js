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
    request.url = url.pathname;

    if (ext == "") {  // This is the Restful section to be
      var route = routes[url.pathname]; // This needs to change
        if (route != undefined)
          if (request.method == route.method)
            return route;
          else
            return handler.create("GET", function(request, response) {
              error(405, request, response);
            });
        else
          return handler.create("GET", function(request, response) {
            error(404, request, response);
          });
    } else if (extensions.indexOf(ext) != -1) { // This is the extension section
      return handler.create("GET", function(request, response) {
        var path_to_file = path.join(public_folder, request.url);
        fs.exists(path_to_file, function(exists) {
          if (!exists)
            error(404, request, response);
          else
            fs.readFile(path_to_file, function(err, data) {
              if (err)
                error(500, request, response);
              else
                response.end(data);
            });
        });
      });
    } else {
      return handler.create("GET", function(request, response) {
        error(406, request, response);
      });
    }
  },
  fetch_from_public: function(file, request, response) {
    var path_to_file = path.join(public_folder, file);
    log.log(" [+] " + request.method + " " + request.url + " => " + path_to_file + " from " + request.connection.remoteAddress);
    fs.exists(path_to_file, function(exists) {
      if (!exists)
        error(404, request, response);
      else
        fs.readFile(path_to_file, function(err, data) {
          if (err)
            error(500, request, response);
          else
            response.end(data);
        });
    });
  }
}
