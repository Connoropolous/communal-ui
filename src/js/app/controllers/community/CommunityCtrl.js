var controller = function($scope, community, currentUser) {

  $scope.community = community;
  $scope.canModerate = currentUser && currentUser.canModerate(community);
  $scope.canInvite = $scope.canModerate || community.settings.all_can_invite;

};

module.exports = function(angularModule) {
  angularModule.controller('CommunityCtrl', controller);
};
