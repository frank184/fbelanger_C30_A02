// Native Modules
var http = require('http');
var path = require('path');
var fs = require('fs');

// Custom Modules
var log = require('./router/log');
var router = require('./router');

// Controllers
var users_controller = require('./controllers/users_controller');

// Paths
var public_folder = path.join(__dirname, "..", "public");

// Valid extensions under public for file serving
router.extensions(".html", ".css", ".js", ".png", ".jpg", ".gif", ".xml", ".txt", ".ico");

// Routes
router.set("GET", "/", function(request, response) {
  fs.exists(public_folder, "index.html", function(exists) {
    if (!exists) error(404, path_to_file, request, response);
    else fs.readFile(path_to_file, function(err, data) {
        if (err) error(500, path_to_file, request, response);
        else response.end(data);
      });
  });
});

// HTTP Server
var port = 9000;
log.log(" [*] Server started on http://localhost:" + port);
http.createServer(function(request, response) {
  handler = router.get(request);
  handler.init(request, response);
}).listen(port);
