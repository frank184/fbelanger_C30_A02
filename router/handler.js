var error = require('../error');

// Handler object
function Handler(callback) {
  this.callback = callback;
};

// Handler handle method, handles response callbacks on request
Handler.prototype.handle = function(request, response) {
  return this.callback.call(this, request, response);
};

// Exports
module.exports = {
  create: function (callback) {
    return new Handler(callback);
  }
};
