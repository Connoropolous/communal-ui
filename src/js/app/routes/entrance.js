module.exports = function($stateProvider) {

  $stateProvider
  .state('appEntry', /*@ngInject*/ {
    parent: 'main',
    url: '/app',
    onEnter: function(currentUser, $state, $timeout) {
      console.log('test', currentUser);
      var membership = currentUser && currentUser.lastUsedMembership();
      $timeout(function() {
        if (membership) {
          $state.go('community.members', {community: membership.community.slug});
        } else if (currentUser) {
          $state.go('home.simple');
        } else {
          $state.go('login');
        }
      });
    }
  })
  .state('entrance', /*@ngInject*/ {
    abstract: true,
    resolve: {
      loggedIn: function(User, $timeout, $state) {
        return User.status().$promise.then(function(res) {
          return res.signedIn;
        });
      },
      context: function() { return 'normal' },
    },
    onEnter: function(loggedIn, $timeout, $state) {
      if (loggedIn) {
        $timeout(function() {
          $state.go('appEntry');
        });
      } else {
        window.hyloEnv.provideUser(null);
      }
    },
    templateUrl: '/ui/entrance/base.tpl.html'
  })
  .state('login', {
    url: '/login?next',
    parent: 'entrance',
    views: {
      entrance: {
        templateUrl: '/ui/entrance/login.tpl.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('signup', {
    url: '/signup?next',
    parent: 'entrance',
    views: {
      entrance: {
        templateUrl: '/ui/entrance/signup.tpl.html',
        controller: 'SignupCtrl'
      }
    }
  })
  .state('signupWithCode', {
    url: '/signupc?code&slug&next',
    parent: 'entrance',
    views: {
      entrance: {
        templateUrl: '/ui/entrance/signup-with-code.tpl.html',
        controller: 'SignupCtrl'
      }
    }
  })
  .state('forgotPassword', {
    url: '/forgot-password',
    parent: 'entrance',
    views: {
      entrance: {
        templateUrl: '/ui/entrance/forgot-password.tpl.html',
        controller: 'ForgotPasswordCtrl'
      }
    }
  })
  .state('useInvitation', /*@ngInject*/{
    url: '/h/use-invitation?token',
    templateUrl: '/ui/user/use-invitation.tpl.html',
    controller: function($scope, Invitation, $stateParams, $state) {
      Invitation.use({token: $stateParams.token}, function(resp) {
        if (resp.signup) {
          Invitation.store(resp);
          $state.go('signup');
        } else {
          $state.go('appEntry');
        }
      }, function (resp) {
        $scope.error = resp.data;
      });
    }
  });

};
