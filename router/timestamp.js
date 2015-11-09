// Exports
module.exports = function() {
  return "[" + new Date().toISOString().replace(/T/," ").replace(/\..+/, "") + "]"
};
