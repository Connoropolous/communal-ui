var controller = function($scope, user, isSelf, growl, $anchorScroll) {
  $scope.user = user;
  $scope.isSelf = isSelf;

  if (!user.banner_url) {
    user.banner_url = require('../services/defaultUserBanner');
  }

  $scope.normalizeUrl = function(url) {
    if (url.substring(0, 4) === 'http')
      return url;

    return 'http://' + url;
  };

  $anchorScroll();
};

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', controller);
};
