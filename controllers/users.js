// Native Modules
var qs = require('querystring');

// Custom Modules
var error = require('../router/error');

// Models
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
    var body = "";
    request.on("data", function(data) {
      body += data;
    });
    request.on("end", function() {
      body = qs.parse(body);
      var user =  User.create(body);
      if (user == undefined)
        error(520, request, response);
      else
        response.end(JSON.stringify(user))
    });
    request.on("error", function(data) {

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
