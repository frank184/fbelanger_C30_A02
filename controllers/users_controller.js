// Native Modules
var URL = require('url');

// Model
var User = require('../models/user');
module.exports = {
  index: function(request, response) {
    User.all(function(users) {
      response.end(JSON.stringify(users));
    });
  },
  new: function(request, response) {
    response.end(JSON.stringify(User.new()));
  },
  create: function(request, response) {
    var chunks;
    request.on("data", function(chunk) {
      chunks += chunk;
    }).on("end", function() {
      response.end(chunks);
    });
  },
  update: function(request, response) {

  },
  delete: function(request, response) {

  }
}

function set_user(id) {
  return User.findSync(id);
}
