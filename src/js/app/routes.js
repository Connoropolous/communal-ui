var routes = function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var state = $injector.get('$state')
    state.go('notFound')
    return $location.path()
  })

  // handle alternate name of starting route
  $urlRouterProvider.when('/', '/app')

  $stateProvider
  .state('notFound', {
    templateUrl: '/ui/app/404.tpl.html'
  })
  .state('main', /* @ngInject*/ {
    abstract: true,
    templateUrl: '/ui/shared/main.tpl.html',
    resolve: {
      currentUser: function (CurrentUser) {
        return CurrentUser.load()
      }
    }
  })
  .state('userSettings', {
    url: '/settings?expand',
    parent: 'main',
    views: {
      main: {
        templateUrl: '/ui/user/settings.tpl.html',
        controller: 'UserSettingsCtrl'
      }
    }
  })
  .state('notifications', {
    url: '/h/notifications',
    parent: 'main',
    views: {
      main: {
        templateUrl: '/ui/user/notifications.tpl.html',
        controller: 'NotificationsCtrl'
      }
    },
    resolve: {
      activity: function (Activity) {
        return Activity.query({limit: 50}).$promise
      }
    }
  })
  .state('search', {
    url: '/search?q&c',
    parent: 'main',
    resolve: /* @ngInject*/ {
      initialQuery: function ($stateParams) {
        return $stateParams.q
      },
      searchCommunity: function ($stateParams, Community) {
        if ($stateParams.c) {
          return Community.get({id: $stateParams.c}).$promise
        }
      }
    },
    views: {
      main: {
        templateUrl: '/ui/app/search.tpl.html',
        controller: 'SearchCtrl'
      }
    }
  })
  
  require('./routes/community')($stateProvider)
  require('./routes/profile')($stateProvider)
  require('./routes/home')($stateProvider)
  require('./routes/network')($stateProvider)
  require('./routes/entrance')($stateProvider)
}

module.exports = function (angularModule) {
  angularModule.config(routes)
}
