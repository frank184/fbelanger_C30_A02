// Native Modules
var URL = require('url');

// Models
var User = require('../models/user');

module.exports = {
  index: function(request, response) {
    User.all(function(users) {
      response.end(users);
    });
  },
  new: function() {
    response.end(User.new());
  },
  get: function(id, request, response) {

  },
  post: function(request, response) {
    var chunks;
    request.on("data", function(chunk) {
      chunks += chunk;
    }).on("end", function(){
      response.end(chunks);
    });
  },
  put: function(request, response) {
    user = this.get(request, response);
  },
  delete: function(request, response) {

  }
}
