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
// GET /users => All user objects in JSON
router.set("GET", "/users", function(request, response) {
  users.index(request, response);
});
// GET /users/new => New empty user object in JSON
router.set("GET", "/users/new", function(request, response) {
  users.new(request, response);
});
// While on the "/" or "/index.html" page, you can use JQuery
// $.post("/users", {});
// $.post("/users/create", {});
// $.ajax({ method: "POST", url: "/users/create", data: {} })
// .done(function(data){
//   $('body').html(data);
// });
router.set("POST", ["/users", "/users/create"], function(request, response) {
  users.create(request, response);
});

// Something like this is currently possible!!! :)
// var sessions = require('./controllers/users/sessions');
// var registrations = require('./controllers/users/registrations');
//
// router.set("POST", "/users/registrations/sign_up", function(request, response) {
//   registrations.create(request, response);
// });
// router.set("POST", "/users/sessions/sign_in", function(request, response) {
//   sessions.create(request, response);
// });

// TODO The Restful Dream:
//    Need to implement params like :id or :comment_id somehow
//    Considering replacing Integers in urls with :id and storing Integers in query or something
// router.set("GET", ["/users/:id", "/users/:id/show"], function(request, response) {
//   users.show(request, response);
// });
// router.set("PUT", ["/users/:id", "/users/:id/edit"], function(request, response) {
//   users.update(request, response);
// });
// router.set("DELETE", ["/users/:id", "/users/:id/destroy", "/users/:id/delete"], function(request, response) {
//   users.destroy(request, response);
// });

// HTTP Server
var PORT = 9000;
// Starting the server displays all routes
log.debug(router.routes);
log.log(" [*] Server started on http://localhost:" + PORT);
http.createServer(function(request, response) {
  handler = router.get(request);
  handler.handle(request, response);
}).listen(PORT);

// TODO Future Implementation:
//  In the future, I would look the router to be a part of a bigger system to do something like:

// var app = native_mvc.createServer();
// app.get("/", function(request, response) {
//    home.index(request, response);
// });
// app.post("/users", "/users/create", function(request, response) {
//    user.create(request, response);
// });
// app.listen(3000);
