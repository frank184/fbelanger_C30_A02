// Native Modules
var querystring = require('querystring');
var events = require('events');
var http = require('http');
var path = require('path');
var fs = require('fs');

// Custom Modules
var errors = require('errors');
var user = require('user');
var log = require('log');

// Paths
var public_folder = path.join(__dirname, "public");
var validExtensions = [ ".html", ".css", ".js", ".png", ".jpg", ".gif", ".xml", ".txt", ".ico", ".json" ];
var validDataObject = [path.join("users")];

// HTTP Server
var port = 9000;
log(" [*] Server started on http://localhost:" + port);
var app = http.createServer(function(request, response) {
  var url = request.url;
	var dir = path.dirname(url);
	var file = path.basename(url) || "index.html";
	var ext = path.extname(file) || ".html";
  var path_to_file = path.join(public_folder, dir, file);
  log(" [+] " + request.method + " " + path_to_file + " for " + request.connection.remoteAddress);

  // GET requests
  if (request.method == "GET") {
    if (validExtensions.indexOf(ext) == -1) {
      errors(406, request, response);
    } else {
      if (validDataObject.indexOf(dir) == -1) {
        fs.exists(path_to_file, function(exists) {
          if (!exists) {
            log(" [-] 404 - Could not find " + path_to_file + " for " + request.connection.remoteAddress);
            errors(404, request, response);
          } else {
            fs.readFile(path_to_file, function(err, data) {
              if (err) {
                log(" [-] 500 - Could not read " + path_to_file + " for " + request.connection.remoteAddress);
                errors(500, request, response);
              } else {
                response.end(data);
              }
            });
          }
        });
      } else {
        var object = path.basename(dir);
        var id = path_to_file.split("/")[2];
        response.end(id);
      }
    }
  }

  // POST requests
  if (request.method == "POST") {
    if (validDataObject.indexOf(dir) == -1) {
      errors(406, request, response);
    } else {
      // var id = path_to_file.split("/")[2];
      // fs.exists(path_to_file, function(exists) {
      //   if (!exists) {
      //     errors(404, request, response);
      //   } else {
      //     fs.readFile(path_to_file, function(err, data) {
      //       if (err) {
      //         errors(500, request, response);
      //       } else {
      //         response.end(data);
      //       }
      //     });
      //   }
      // });
    }
  }
}).listen(port);
