module.exports = function ($stateProvider) {
  $stateProvider
  .state('network', {
    url: '/n/:slug',
    parent: 'main',
    abstract: true,
    resolve: {
      network: /* @ngInject*/ function (Network, $stateParams) {
        return Network.get({id: $stateParams.slug}).$promise
      }
    },
    views: {
      main: {
        templateUrl: '/ui/app/network.tpl.html',
        controller: function ($scope, network) {
          'ngInject'
          $scope.network = network
        }
      }
    }
  })
  .state('network.communities', {
    url: '/communities',
    resolve: {
      communities: /* @ngInject*/ function (network) {
        return network.communities().$promise
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/network/communities.tpl.html',
        controller: function ($scope, communities) {
          'ngInject'
          $scope.communities = communities
        }
      }
    }
  })
  .state('network.members', {
    url: '/members',
    resolve: /* @ngInject*/ {
      usersQuery: function (network) {
        return network.members().$promise
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/network/members.tpl.html',
        controller: function ($scope, $timeout, usersQuery, network) {
          'ngInject'
          $scope.users = usersQuery.people

          $scope.loadMore = _.debounce(function () {
            if ($scope.loadMoreDisabled) return
            $scope.loadMoreDisabled = true

            network.members({offset: $scope.users.length}, function (resp) {
              $scope.users = _.uniq($scope.users.concat(resp.people), u => u.id)

              if (resp.people.length > 0 && $scope.users.length < resp.people_total) {
                $timeout(() => $scope.loadMoreDisabled = false)
              }
            })
          }, 200)
        }
      }
    }
  })
  .state('network.about', {
    url: '/about',
    resolve: {

    },
    views: {
      tab: {
        templateUrl: '/ui/network/about.tpl.html',
        controller: function ($scope, network) {
          'ngInject'
          $scope.network = network
        }
      }
    }
  })
}
