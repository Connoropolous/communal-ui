var directive = function() {

  var controller = function($scope, $element) {
    $scope.twitterUrl = function() {
      return 'https://twitter.com/' + $scope.user.twitter_name;
    };

    $scope.hasSocialMediaLink = function() {
      return $scope.user.twitter_name || $scope.user.linkedin_url || $scope.user.facebook_url;
    };

    $scope.clickedSocialLink = function(network, url) {};

    $scope.trackEmail = function() {};
  };

  return {
    restrict: 'E',
    replace: true,
    scope: {
      user: '=',
      page: '=',
      isSelf: '='
    },
    templateUrl: "/ui/app/socialMedia.tpl.html",
    controller: controller
  };
};

module.exports = function(angularModule) {
  angularModule.directive('socialMedia', directive);
};
