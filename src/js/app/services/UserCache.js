// FIXME: this cries out for DRYing

var factory = function(User, Cache) {

  var api = {};

  return api;
};

module.exports = function(angularModule) {
  angularModule.factory('UserCache', factory);
};
