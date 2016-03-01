var controller = function($scope, community, currentUser, extraProperties, $history, $location) {
  $scope.community = community
  $scope.canModerate = currentUser && currentUser.canModerate(community);

  _.merge(community, extraProperties)
  var origin = $location.absUrl().replace($location.path(), '')
  $scope.join_url = origin + '/c/' + community.slug + '/join/' + community.beta_access_code

  $scope.invitationSubject = format("Join %s on Communal", community.name)

  $scope.invitationText = format("%s is using Communal",
    community.name);

  $scope.invite = function() {
    if ($scope.submitting) return;
    $scope.submitting = true;
    $scope.inviteResults = null;

    community.invite({
      emails: $scope.emails,
      subject: $scope.invitationSubject,
      message: $scope.invitationText,
      moderator: $scope.inviteAsModerator
    })
    .$promise.then(function(resp) {
      $scope.inviteResults = resp.results;
      $scope.emails = '';
      $scope.submitting = false;
    }, function() {
      alert('Something went wrong. Please check the emails you entered for typos.');
      $scope.submitting = false;
    });
  };

  $scope.close = function () {
    if ($history.isEmpty()) {
      $scope.$state.go('community.members', {community: community.slug});
    } else {
      $history.back();
    }
  };

  $scope.editing = false

  $scope.edit = function () {
    $scope.editing = true
  }

  $scope.saveEdit = function () {
    community.update(community, function() {
      $scope.join_url = origin + '/c/' + community.slug + '/join/' + community.beta_access_code
    })
    $scope.editing = false
  }

  $scope.cancelEdit = function () {
    $scope.editing = false
  }

};

module.exports = function (angularModule) {
  angularModule.controller('CommunityInviteCtrl', controller);
}
