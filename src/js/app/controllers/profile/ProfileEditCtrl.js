var filepickerUpload = require('../../services/filepickerUpload')

module.exports = function ($scope, currentUser, growl, onboarding, $rootScope) {
  'ngInject'
  var user = $scope.user = currentUser
  var editData = $scope.editData = _.pick(user, [
    'name', 'bio', 'work', 'intention', 'extra_info', 'avatar_url', 'banner_url',
    'skills', 'organizations', 'phones', 'emails', 'websites',
    'twitter_name', 'linkedin_url', 'facebook_url'
  ])
  var edited = {}
  var bio = editData.bio

  $scope.multiInput = {}

  var checkUnsavedChanges = function () {
    var unsavedChanges = _.filter(_.pairs($scope.multiInput), p => p[1])
    if (_.any(unsavedChanges)) {
      var unsavedChangeFields = _.map(unsavedChanges, p => format('"%s"', p[0])).join(' and ')
      window.alert(format('You have entered text for %s. Make sure to press Return if you want to save it.', unsavedChangeFields))
      return false
    }
    return true
  }

  $rootScope.$on('$stateChangeStart', function (event) {
    if (!checkUnsavedChanges()) event.preventDefault()
  })

  $scope.save = function () {
    if (!checkUnsavedChanges()) return

    if (editData.banner_url === require('../../services/defaultUserBanner')) {
      editData.banner_url = null
    }

    var saveData = _.clone(editData)

    if (!edited.skills) delete saveData.skills

    if (!edited.organizations) delete saveData.organizations

    user.update(saveData, function () {
      _.extend(user, saveData)

      if (onboarding && onboarding.currentStep() === 'profile') {
        onboarding.goNext()
      } else {
        $scope.cancel()
      }
    })
  }

  $scope.cancel = function () {
    $scope.$state.go('profile.about', {id: user.id})
  }

  $scope.add = function (event, type, name) {
    if (event.which === 13) {
      if (!_.contains(editData[type], event.target.value)) {
        editData[type].unshift(event.target.value)
      }

      $scope.multiInput[name] = null
      edited[type] = true
    }
    return true
  }

  $scope.remove = function (value, type) {
    editData[type].splice(editData[type].indexOf(value), 1)
    edited[type] = true
  }

  var imageChangeFn = function (opts) {
    return function () {
      filepickerUpload({
        path: opts.path,
        convert: opts.convert,
        success: function (url) {
          $scope.$apply(function () {
            editData[opts.fieldName] = url
          })
        },
        failure: function (error) {
          if (error.code !== 101) {
            $scope.$apply(function () {
              growl.addErrorMessage('An error occurred while uploading the image. Please try again.')
            })
          }
        }
      })
    }
  }

  $scope.changeAvatar = imageChangeFn({
    fieldName: 'avatar_url',
    humanName: 'Icon',
    path: format('user/%s/avatar', user.id),
    convert: {width: 200, height: 200, fit: 'crop', rotate: 'exif'}
  })

  $scope.changeBanner = imageChangeFn({
    fieldName: 'banner_url',
    humanName: 'Banner',
    path: format('user/%s/banner', user.id),
    convert: {width: 1600, format: 'jpg', fit: 'max', rotate: 'exif'}
  })

  $scope.changeTwitter = function () {
    var response = window.prompt(
      'Enter your Twitter username, or leave blank:',
      editData.twitter_name
    )

    editData.twitter_name = response

  }

  $scope.changeFacebook = function () {
    if (editData.facebook_url) {
      if (window.confirm('Choose OK to remove your Facebook information.')) {
        editData.facebook_url = null
      }
    } else {
      window.FB.login(function () {
        window.FB.api('/me', function (resp) {
          // TODO store linked account
          $scope.$apply(function () {
            editData.facebook_url = resp.link
          })
        })
      })
    }
  }

  $scope.changeLinkedin = function () {
    if (editData.linkedin_url) {
      if (window.confirm('Choose OK to remove your LinkedIn information.')) {
        editData.linkedin_url = null
      }
    } else {
      var left = document.documentElement.clientWidth / 2 - 200
      $scope.linkedinDialog = window.open('/noo/linkedin/authorize', 'linkedinAuth',
        'width=400, height=625, titlebar=no, toolbar=no, menubar=no, left=' + left)
    }
  }

  $scope.finishLinkedinChange = function (url) {
    $scope.$apply(function () {
      editData.linkedin_url = url
      $scope.linkedinDialog.close()
    })
  }
}
