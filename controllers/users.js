// Native Modules
var qs = require('querystring');

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
      body += qs.parse(data);
    });
    request.on("end", function() {
      var user =  User.create(body);
      if (user == undefined)
        error(520, request, response);
      else
        response.end(JSON.stringify(user))
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
