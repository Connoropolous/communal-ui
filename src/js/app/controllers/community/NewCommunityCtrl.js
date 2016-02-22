var filepickerUpload = require('../../services/filepickerUpload');

var controller = function ($scope, $timeout, $analytics, $history, Community, growl, currentUser) {

  $scope.uploading = {};

  var community = $scope.community = new Community({
    banner_url: "https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg",
    avatar_url: "https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png"
  });

  var imageChangeFn = function(opts) {
    return function() {
      $scope.uploading[opts.fieldName] = true;
      filepickerUpload({
        path: opts.path,
        convert: opts.convert,
        success: function(url) {
          $scope.uploading[opts.fieldName] = false;
          community[opts.fieldName] = url;
          $scope.$apply();
          $analytics.eventTrack('Create Community: Uploaded ' + opts.humanName, {
            community_id: community.slug,
            moderator_id: currentUser.id
          });
        },
        failure: function(error) {
          $scope.uploading[opts.fieldName] = false;
          $scope.$apply();
          if (error.code == 101) return;

          growl.addErrorMessage('An error occurred while uploading the image. Please try again.');
          $analytics.eventTrack('Create Community: Failed to Upload ' + opts.humanName, {
            community_id: community.slug,
            moderator_id: currentUser.id
          });
        }
      });
    };
  };

  $scope.changeIcon = imageChangeFn(community.avatarUploadSettings());

  $scope.close = function () {
    if ($history.isEmpty()) {
      $scope.$state.go('appEntry');
    } else {
      $history.back();
    }
  };

  $scope.submit = function(form) {
    form.submitted = true;
    if (form.$invalid) {
      $timeout(function() {
        // go to the bottom of the page, because the appearance of errors
        // expands the height of the content above the Save button,
        // so the error message may end up offscreen.
        // yes, I know this isn't supposed to be in a controller.
        var container = document.getElementById('main-container');
        container.scrollTop = container.children[0].clientHeight;
      });
      return;
    }

    $scope.saving = true;
    Community.save(community, function (membership) {
      $analytics.eventTrack('Create Community: Finished', {community_id: community.slug});
      currentUser.memberships = [membership].concat(currentUser.memberships);
      $scope.saving = false;
      $scope.$state.go("community.settings", {community: community.slug, tools: 1, new: 1});
    });
  };

};

module.exports = function(angularModule) {
  angularModule.controller('NewCommunityCtrl', controller);
}
