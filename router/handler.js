var error = require('./error');

// Handler object
function Handler(callback) {
  this.callback = callback;
};

// init callback
Handler.prototype.init = function(request, response) {
  // return this.callback.call(this, request, response);
  return this.callback.call(this, request, response);
};

// Exports
module.exports = {
  create: function (callback) {
    return new Handler(callback);
  }
};
