function Handler(callback) {
  this.callback = callback;
};

Handler.prototype.start = function(request, response) {
  this.callback.call(request, response);
};

module.exports = {
  create: function (callback) {
    return new Handler(callback);
  }
};
