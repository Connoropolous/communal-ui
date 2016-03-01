var handleError = function (err, $scope) {
  var msg = err.data
  var email = $scope.user.email
  if (!msg) {
    $scope.signupError = "Couldn't sign up. Please try again."
    return
  }

  if (msg.match(/Key.*already exists/)) {
    var match = msg.match(/Key \((.*)\)=\((.*)\) already exists/)
    var key = match[1]
    var value = match[2]

    $scope.signupError = format('The %s "%s" is already in use. Try logging in instead?', key, value)
  } else {
    $scope.signupError = msg
  }
}

module.exports = function ($scope, User, Community, ThirdPartyAuth, Invitation, context, projectInvitation, $stateParams, $state) {
  'ngInject'
  $scope.user = {}

  if ($state.current.name === 'signupWithCode') {
    Community.get({id: $stateParams.slug}).$promise
    .then((community) => $scope.community = community)
    .catch(() => $scope.signupError = "We couldn't find a community with that name. Please check your link and try again.")
  }

  $scope.invitation = Invitation.storedData() || projectInvitation

  var finishSignup = provider => {
    if ($stateParams.next) {
      window.history.pushState(null, null, $stateParams.next)
    } else if (context === 'modal') {
      $scope.$close({action: 'finish'})
    } else {
      $scope.$state.go('appEntry')
    }
  }

  $scope.submit = function (form) {
    form.submitted = true
    $scope.signupError = null
    if (form.$invalid) return

    var params = _.merge({}, $scope.user, {login: true}, projectInvitation)

    User.signup(params).$promise.then(function (user) {
      finishSignup('password')
    }, function (err) {
      handleError(err, $scope)
    })
  }

  $scope.useThirdPartyAuth = function (service, form) {
    $scope.authStarted = true
    $scope.serviceUsed = service
    $scope.authDialog = ThirdPartyAuth.openPopup(service)
  }

  $scope.finishThirdPartyAuth = function (error) {
    $scope.$apply(function () {
      $scope.authDialog.close()
      if (error) {
        handleError({data: error}, $scope)
      } else {
        finishSignup($scope.serviceUsed)
      }
    })
  }

  $scope.go = function (state) {
    if (context === 'modal') {
      $scope.$close({action: 'go', state: state})
    } else {
      $scope.$state.go(state, {next: $stateParams.next})
    }
  }
}
