// Native Modules
var http = require('http');
var path = require('path');
var fs = require('fs');

// Custom Modules
var router = require('./router');
var log = require('./router/log');

// Controllers
var users = require('./controllers/users');

// Router
router.extensions(".html", ".css", ".js", ".png", ".jpg", ".gif", ".xml", ".txt", ".ico");
router.set("GET", "/", function(request, response) {
  router.public("index.html", request, response);
});
router.set("GET", "/users", function(request, response) {
  users.index(request, response);
});
router.set("GET", "/users/new", function(request, response) {
  users.new(request, response);
});
router.set("POST", ["/users", "/users/create"], function(request, response) {
  users.create(request, response);
});
// TODO The Restful Dream:
//    Need to implement params like :id or :comment_id somehow
//    Considering replacing Integers in urls with :id and storing Integers in query or something
//
// router.set("GET", ["/users/:id", "/users/:id/show"], function(request, response) {
//   users.show(request, response);
// });
// router.set("PUT", ["/users/:id", "/users/:id/edit"], function(request, response) {
//   users.update(request, response);
// });
// router.set("DELETE", "/users/:id", function(request, response) {
//   users.destroy(request, response);
// });

// HTTP Server
var PORT = 9000;
log.debug("Routes:", router.routes);
log.log(" [*] Server started on http://localhost:" + PORT);
http.createServer(function(request, response) {
  handler = router.get(request);
  handler.handle(request, response);
}).listen(PORT);
