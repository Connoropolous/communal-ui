module.exports = function ($stateProvider) {

  $stateProvider
  .state('home', {
    abstract: true,
    parent: 'main',
    resolve: {
      requireLogin: /*@ngInject*/ function(User, currentUser) {
        return User.requireLogin(currentUser);
      }
    },
    data: {
      showTabs: true
    },
    views: {
      main: {
        templateUrl: '/ui/home/show.tpl.html',
        controller: function() {}
      }
    }
  })
  .state('home.simple', /*@ngInject*/ {
    url: '/h/starting-out',
    resolve: {

    },
    data: {
      showTabs: false
    },
    views: {
      tab: {
        templateUrl: '/ui/home/simple.tpl.html',
        controller: function($scope, currentUser, $dialog, joinCommunity, Community) {
          'ngInject';

          $scope.currentUser = currentUser;

          $scope.leaveCommunity = function (communityId, index) {
            $dialog.confirm({
              message: 'Are you sure you want to leave this community?'
            }).then(function () {
              Community.leave({id: communityId}, function () {
                user.memberships.splice(index, 1)
              })
            })
           }

           $scope.joinCommunity = joinCommunity
        }
      }
    }
  })
};
