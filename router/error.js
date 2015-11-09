// Native Modules
var path = require('path');
var url = require('url');
var fs = require('fs');

// Custom Modules
var log = require('./log');

// Paths
var errors_folder = path.join(__dirname, "..", "public", "errors");

// Exports
var statusCodes = {
  "404": "File not Found",
  "406": "Unsuppoerted Extension",
  "500": "Internal Error",
  "520": "Unknown Error"
}
module.exports = function(statusCode, path_to_file, request, response) {
  response.writeHead(statusCode);
  log(" [-] " + statusCode + " - " + statusCodes[statusCode] + " " + path_to_file + " for " + request.connection.remoteAddress);
  path_to_file = path.join(errors_folder, statusCode + ".html");
  fs.readFile(path_to_file, function(err, data){
    if (err) throw err;
    log.log(" [+] " + request.method + " from " + request.connection.remoteAddress + " for " + path_to_file);
    response.end(data);
  });
};
