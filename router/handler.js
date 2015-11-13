var error = require('./error');

// Handler object
function Handler(method, callback) {
  this.method = method;
  this.callback = callback;
};

// init callback
Handler.prototype.init = function(request, response) {
  return this.callback.call(this, request, response);
};

// Exports
module.exports = {
  create: function (method, callback) {
    return new Handler(method, callback);
  }
};
