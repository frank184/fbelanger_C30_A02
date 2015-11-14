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
    if (!method)
      throw new Error("This method requires a request method parameter.")
    if (!url)
      throw new Error("This method requires a url parameter.");
    if (!callback)
      throw new Error("This method requires a callback parameter.");

    if (url.constructor == Array)
      for (i in url)
        if (routes[url[i]] == undefined) {
          routes[url[i]] = {};
          routes[url[i]][method] = handler.create(callback);
        } else {
          routes[url[i]][method] = handler.create(callback);
        }
    else
      if (routes[url] == undefined) {
        routes[url] = {};
        routes[url][method] = handler.create(callback);
      } else {
        routes[url][method] = handler.create(callback);
      }
  },
  get: function(request) {
    var url = request.url;
    var dir = path.dirname(url);
    var file = path.basename(url);
    var ext = path.extname(url);
    var url = URL.parse(path.join(dir, file));
    request.url = url.pathname; // the precedent fixed

    if (ext == "") { // RestAPI
      var route = routes[url.pathname];
      if (route == undefined) {
        return handler.create(function(request, response) {
          error(404, request, response);
        });
      } else {
        var callback = route[request.method];
        if (callback == undefined)
          return handler.create(function(request, response) {
            error(405, request, response);
          });
        else
          return callback;
      }
    } else if (extensions.indexOf(ext) != -1) { // This is the extension section
      return handler.create(function(request, response) {
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
      return handler.create(function(request, response) {
        error(406, request, response);
      });
    }
  },
  public: function(file, request, response) {
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
