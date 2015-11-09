// Handler object
function Handler(callback) {
  this.callback = callback;
};
// init callback
Handler.prototype.init = function(request, response) {
  // 1st this) Handler: this Handler's callback
  // 2nd this) callback: whatever function call is applied to
  return this.callback.call(this, request, response);
};

// Exports
module.exports = {
  create: function (callback) {
    return new Handler(callback);
  }
}
