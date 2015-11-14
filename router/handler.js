var error = require('./error');

// Handler object
function Handler(callback) {
  this.handle = function(request, response) {
    return callback.call(this, request, response);
  }
};

// Exports
module.exports = {
  create: function (callback) {
    return new Handler(callback);
  }
};
