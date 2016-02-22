module.exports = function ($stateProvider) {
  $stateProvider
  .state('community', {
    abstract: true,
    url: '/c/:community',
    parent: 'main',
    views: {
      main: {
        template: "<div ui-view='community'></div>"
      }
    },
    resolve: /* @ngInject*/ {
      community: function (Community, $stateParams, $rootScope) {
        return Community.get({id: $stateParams.community}).$promise
      }
    }
  })

  .state('community.home', {
    abstract: true,
    parent: 'community',
    views: {
      community: {
        templateUrl: '/ui/community/base.tpl.html',
        controller: 'CommunityCtrl'
      }
    }
  })

  .state('community.join', {
    url: '/join/:code',
    parent: 'community',
    views: {
      community: {
        templateUrl: '/ui/community/join.tpl.html',
        controller: 'JoinCommunityByUrlCtrl'
      }
    },
    resolve: /* @ngInject*/ {
      community: function (Community, $stateParams, $rootScope) {
        return Community.get({id: $stateParams.community}).$promise
      },
      code: function ($stateParams) {
        return $stateParams.code
      },
      requireLogin: /* @ngInject*/ function (User, currentUser, $stateParams) {
        return User.requireLogin(currentUser, 'signupWithCode', $stateParams.code, $stateParams.community)
      }
    }
  })
 .state('community.about', {
    url: '/about',
    parent: 'community.home',
    views: {
      tab: {
        templateUrl: '/ui/community/about.tpl.html',
        controller: function () {}
      }
    }
  })
  .state('community.members', {
    url: '/members',
    parent: 'community.home',
    views: {
      tab: {
        templateUrl: '/ui/community/members.tpl.html',
        controller: 'CommunityMembersCtrl'
      }
    },
    resolve: /* @ngInject*/ {
      usersQuery: function (community, Cache) {
        var key = 'community.members:' + community.id
        var cached = Cache.get(key)

        if (cached) {
          return cached
        } else {
          return community.members().$promise.then(function (resp) {
            Cache.set(key, resp, {maxAge: 10 * 60})
            return resp
          })
        }
      }
    }
  })
  .state('community.tools', {
    url: '/tools',
    parent: 'community.home',
    views: {
      tab: {
        templateUrl: '/ui/community/tools.tpl.html',
        controller: 'CommunityToolsCtrl'
      }
    },
    resolve: /* @ngInject*/ {
      toolsQuery: function (community, Cache) {
        var key = 'community.tools:' + community.id
        var cached = Cache.get(key)

        if (cached) {
          return cached
        } else {
          return community.tools().$promise.then(function (resp) {
            Cache.set(key, resp, {maxAge: 10 * 60})
            return resp
          })
        }
      }
    }
  })
  .state('createCommunity', {
    url: '/h/new-community',
    parent: 'main',
    resolve: {
      requireLogin: /* @ngInject*/ function (User, currentUser) {
        return User.requireLogin(currentUser)
      }
    },
    views: {
      'main': {
        templateUrl: '/ui/community/create.tpl.html',
        controller: 'NewCommunityCtrl'
      }
    }
  })
  .state('community.settings', {
    url: '/settings?tools&new',
    resolve: {
      extraProperties: /* @ngInject*/ function (community) {
        return community.getSettings().$promise
      },
      tools: /* @ngInject*/ function (community) {
        return community.tools().$promise
      }
    },
    views: {
      community: {
        templateUrl: '/ui/community/settings.tpl.html',
        controller: 'CommunitySettingsCtrl'
      }
    }
  })
  .state('community.invite', {
    url: '/invite',
    resolve: {
      extraProperties: /* @ngInject*/ function (community) {
        return community.getSettings().$promise
      }
    },
    views: {
      community: {
        templateUrl: '/ui/community/invite.tpl.html',
        controller: 'CommunityInviteCtrl'
      }
    }
  })
}
