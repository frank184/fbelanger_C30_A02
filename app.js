// Native Modules
var http = require('http');
var path = require('path');
var fs = require('fs');

// Custom Modules
var log = require('./router/log');
var router = require('./router');

// Controllers
var users_controller = require('./controllers/users_controller');

// Valid extensions under public for file serving
router.extensions(".html", ".css", ".js", ".png", ".jpg", ".gif", ".xml", ".txt", ".ico");

// Routes
router.set("GET", "/", function(request, response) {
  router.fetch_from_public("index.html", request, response);
});

// The Dream
// router.set("GET", "/users", function(request, response) {
//   users_controller.new(request, response);
// });
// router.set("POST", "/users", function(request, response) {
//   users_controller.create(request, response);
// });
// router.set("GET", "/users/:id", function(request, response) {
//   users_controller.show(request, response);
// });
// router.set("PUT", "/users/:id", function(request, response) {
//   users_controller.update(request, response);
// });
// router.set("DELETE", "/users/:id", function(request, response) {
//   users_controller.destroy(request, response);
// });

// HTTP Server
var port = 9000;
log.log(" [*] Server started on http://localhost:" + port);
http.createServer(function(request, response) {
  handler = router.get(request);
  handler.init(request, response);
}).listen(port);
