var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  username: String,
  password: String
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  console.log('comparePassword was called');
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    console.log('isMatch?',isMatch);
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      console.log('this.password', this.password);
  });
};

userSchema.pre('save', function(next){
  console.log('password is hashed');
  this.hashPassword();
  next();
});

var User = mongoose.model('User', userSchema);
// var db = require('../config');
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

module.exports = User;
