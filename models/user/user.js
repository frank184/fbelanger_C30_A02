// Native Modules
var readline = require('readline');
var path = require('path');
var fs = require('fs');

// Paths
var users_file = path.join(__dirname, "..", "..", "db", "users", "users.txt");
var nextID_file = path.join(__dirname, "..", "..", "db", "users", "nextID.txt");

// User object
function User(data) {
  this.id = null;
  this.firstName = null;
  this.lastName = null;
  this.username = null;
  this.emailAddress = null;
  this.phoneNumber = null;

  // user.create({emailAddress: "user@mail.com"})
  if (arguments[0] != undefined) {
    if (arguments[0].constructor == Object) {
      for (key in arguments[0])
        if (key != "id") // please don't play with ids
          if (this.hasOwnProperty(key))
            this[key] = arguments[0][key]
    } else {
      throw new Error("parameter must be an object");
    }
  } // if arguments[0] != undefined
};
// Number of keys (prototype attribute don't count as keys)
User.prototype.length = 6;
// Factory
User.prototype.factory = function(data) {

};
// get/set firstName
User.prototype.getFirstName = function() {
  return this.firstName;
};
User.prototype.setFirstName = function(firstName) {
  this.firstName = firstName;
};
// get/set lastName
User.prototype.getLastName = function() {
  return this.lastName;
};
User.prototype.setLastName = function(lastName) {
  this.lastName = lastName;
};
// get/set username
User.prototype.getUsername = function() {
  return this.username;
};
User.prototype.setUsername = function(username) {
  this.username = username;
};
// get/set emailAddress
User.prototype.getEmailAddress = function() {
  return this.emailAddress;
};
User.prototype.setEmailAddress = function(emailAddress) {
  this.emailAddress = emailAddress;
};
// get/set phoneNumber
User.prototype.getPhoneNumber = function() {
  return this.phoneNumber;
};
User.prototype.setPhoneNumber = function(phoneNumber) {
  this.phoneNumber = phoneNumber;
};
// toString
User.prototype.toString = function() {
  return  this.id + ","
        + this.firstName + ","
        + this.lastName + ","
        + this.username + ","
        + this.emailAddress + ","
        + this.phoneNumber;
};
// equals
User.prototype.equals = function(user) {
  return this.id == user.id
      && this.firstName == user.firstName
      && this.lastName == user.lastName
      && this.username == user.username
      && this.emailAddress == user.emailAddress
      && this.phoneNumber == user.phoneNumber;
};

// Exports
module.exports = {
  // CRUD User actions
  // TODO:
  // Imcomplete methods, implement emitters for async completed and better new, create.
  // Refactor find and findSync to not use all, allSync and all, allSync should return an array.
  new: function(callback) {
    return new User();
  },
  create: function(data) {
    var user = new User(data);
    // Synchronously to capture id
    fs.readFileSync(nextID_file, function(err, data) {
      if (err) throw err;
      user.id = parseInt(data);
      // Asynchronously because we can
      fs.appendFile(users_file, user + "\n", function(err) {
        if (err) throw err;
        var nextID = user.id + 1;
        fs.writeFile(nextID_file, nextID, function(err, data) {
          if (err) throw err;
        });
      });
    });
    return user;
  },
  find: function(id, callback) {
    if (isNaN(id)) throw new Error("id must be an Integer");
    this.all(function(users) {
      if (!callback) throw Error("this method requires a callback use allSync otherwise");
      else callback(users[parseInt(id)]);
    });
  },
  findSync: function(id, callback) {
    if (isNaN(id)) throw new Error("id must be an Integer");
    var users = this.allSync();
    var user = users[parseInt(id)];
    if (callback) callback(user);
    return user;
  },
  all: function(callback) {
    fs.readFile(users_file, function(err, data) {
      if (err) throw err;
      var users = {};
      var lines = (data.toString()).split("\n");
      for (var i = 0; i < lines.length; i++) {
        var csv = lines[i].split(",");
        // checks for empty lines
        if (csv.length == User.prototype.length) {
          var data = {
            // design disallows id maniplation unless directly
            firstName:    csv[1],
            lastName:     csv[2],
            username:     csv[3],
            emailAddress: csv[4],
            phoneNumber:  csv[5]
          };
          var user = new User(data);
          user.id = csv[0]; // required because of design
          users[user.id] = user;
        }
      }
      if (!callback) throw new Error("this method requires a callback use allSync otherwise");
      else callback(users);
    });
  },
  allSync: function(callback) {
    var users = {};
    var data = fs.readFileSync(users_file);
    var lines = (data.toString()).split("\n");
    for (var i = 0; i < lines.length; i++) {
      var csv = lines[i].split(",");
      // checks for empty lines
      if (csv.length == User.prototype.length) {
        var data = {
          // design disallows id maniplation unless directly
          firstName:    csv[1],
          lastName:     csv[2],
          username:     csv[3],
          emailAddress: csv[4],
          phoneNumber:  csv[5]
        };
        var user = new User(data);
        user.id = csv[0]; // required because of design
        users[user.id] = user;
      }
    }
    if (callback) callback(users);
    return users;
  },
  update: function(id, data, callback) {
  },
  updateSync: function(id, data, callback) {
  },
  destroy: function(id, callback) {
  },
  destroySync: function(id, callback) {
  }
};
