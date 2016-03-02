var RichText = require('../services/RichText')

module.exports = function ($stateProvider) {
  $stateProvider
  .state('profile', {
    parent: 'main',
    url: '/u/:id',
    abstract: true,
    resolve: /*@ngInject*/ {
      isSelf: function(currentUser, $stateParams) {
        return currentUser && currentUser.id === $stateParams.id;
      },
      user: function(User, isSelf, $stateParams, currentUser) {
        if (isSelf) {
          return currentUser;
        } else {
          return User.get({id: $stateParams.id}).$promise;
        }
      }
    },
    views: {
      main: {
        templateUrl: '/ui/profile/base.tpl.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('profile.about', {
    url: '/about',
    views: {
      tab: {
        templateUrl: '/ui/profile/about.tpl.html',
        controller: function($scope, user) {
          'ngInject'
          $scope.extra_info = RichText.markdown(user.extra_info)
        }
      }
    }
  })
  .state('editProfile', {
    url: '/edit-profile',
    parent: 'main',
    views: {
      'main': {
        templateUrl: '/ui/profile/edit.tpl.html',
        controller: 'ProfileEditCtrl'
      }
    }
  });
};
