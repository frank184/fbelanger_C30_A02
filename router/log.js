// Native Modules
var fs = require('fs');

// Custom Modules
var timestamp  = require('./timestamp');

// Exports
module.exports = {
  log: function(data){
    fs.appendFile("server.log", timestamp() + data + "\n", function(err) {
      if (err) throw err;
      console.log(timestamp() + data);
    });
  },
  debug: function() {
    if (!arguments[0]) throw new Error("This method requires parameter to print.");
      for (i in arguments)
        console.log(arguments[i])
  }
}
