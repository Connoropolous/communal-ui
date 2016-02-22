module.exports = function ($scope, growl, $stateParams, $analytics, currentUser, $history, $dialog) {
  'ngInject'
  var user = $scope.user = currentUser
  var editing = $scope.editing = {}
  var edited = $scope.edited = {}

  $scope.expand1 = true
  
  if ($stateParams.expand === 'password') {
    $scope.expand1 = true
    editing.password = true
  }

  if ($stateParams.expand === 'prompts') {
    $scope.expand1 = true
  }

  $scope.close = function () {
    if ($history.isEmpty()) {
      $scope.$state.go('profile.about', {id: user.id})
    } else {
      $history.go(-1)
    }
  }

  $scope.edit = function (field) {
    edited[field] = user[field]
    editing[field] = true
  }

  $scope.cancelEdit = function (field) {
    editing[field] = false
  }

  $scope.saveEdit = function (field, form) {
    if (form && form.$invalid) return

    editing[field] = false
    var data = {}
    data[field] = edited[field]

    user.update(data, function () {
      user[field] = edited[field]
      $analytics.eventTrack('User Settings: Changed ' + field, {user_id: user.id})
      growl.addSuccessMessage('Saved change.')
    }, function (err) {
      growl.addErrorMessage(err.data)
    })
  }

  $scope.toggle = function (field, isInSettings) {
    var data = {}
    if (isInSettings) {
      data.settings = {}
      data.settings[field] = user.settings[field]
    } else {
      data[field] = user[field]
    }
    user.update(data, function () {
      growl.addSuccessMessage('Saved change.')
    }, function (err) {
      growl.addErrorMessage(err.data)
    })
  }

}
