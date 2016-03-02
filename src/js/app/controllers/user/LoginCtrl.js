var handleError = function (err, $scope) {
  var msg = err.data
  if (!msg) {
    $scope.loginError = "Couldn't log in. Please try again."
    return
  }

  var noPasswordMatch = msg.match(/password account not found. available: \[(.*)\]/)
  if (noPasswordMatch) {
    var options = noPasswordMatch[1].split(',')
    if (options[0] === '') {
      $scope.loginError = format("Your account has no password set. <a href='/forgot-password'>Set your password</a>")
    } else {
      $scope.loginError = format('Your account has no password set. Please log in with %s.',
        _.map(options, function (x) { return _.capitalize(x) }).join(' or '))
    }

  } else if (msg === 'password does not match') {
    $scope.loginError = 'The password you entered is incorrect.'

  } else if (msg === 'email not found') {
    $scope.loginError = 'The email address you entered was not recognized.'

  } else if (msg === 'no community') {
    $scope.loginError = 'You are not a member of any community yet. Please sign up first.'

  } else {
    $scope.loginError = msg
  }
}

var finishLogin = function ($scope, $stateParams, context) {
  console.log('finishing login', $scope, $stateParams, context);
  if ($stateParams.next) {
    window.history.pushState(null, null, $stateParams.next)
  } else if (context === 'modal') {
    $scope.$close({action: 'finish'})
  } else {
    console.log('doing this');
    $scope.$state.go('appEntry')
  }
}

module.exports = function ($scope, $stateParams, User, ThirdPartyAuth, context) {
  'ngInject'
  $scope.user = {}

  $scope.submit = function (form) {
    form.submitted = true
    $scope.loginError = null
    if (form.$invalid) return

    User.login($scope.user).$promise.then(function () {
      finishLogin($scope, $stateParams, context)
    }, function (err) {
      handleError(err, $scope)
    })
  }

  $scope.useThirdPartyAuth = function (service) {
    $scope.serviceUsed = service
    $scope.authDialog = ThirdPartyAuth.openPopup(service)
  }

  $scope.finishThirdPartyAuth = function (error) {
    $scope.authDialog.close()
    $scope.$apply(function () {
      if (error) {
        handleError({data: error}, $scope)
      } else {
        finishLogin($scope, $stateParams, context)
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
