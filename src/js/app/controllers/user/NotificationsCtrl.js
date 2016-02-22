var truncate = require('html-truncate');

var controller = function($scope, currentUser, Activity, activity, $analytics) {

  $scope.activity = activity;

  $analytics.eventTrack('Notifications: View');
  currentUser.update({new_notification_count: 0}, function() {
    currentUser.new_notification_count = 0;
  });

  $scope.actionText = function(event) {
    switch(event.action) {
      case 'mention':
        if (_.isEmpty(event.comment))
          return 'mentioned you in their ' + event.post.type;
        else
          return 'mentioned you in a comment on';

      case 'comment':
        return 'commented on';

      case 'followAdd':
        return 'added you to the ' + event.post.type;

      case 'follow':
        return 'followed';

      case 'unfollow':
        return 'stopped following';
    };
  };

  $scope.hasBodyText = function(event) {
    if (_.contains(['followAdd', 'follow', 'unfollow'], event.action))
      return false;

    return !!(event.comment.comment_text || event.post.description);
  }

  $scope.markAllRead = function() {
    $analytics.eventTrack('Notifications: Mark all as read');
    Activity.markAllRead();
    currentUser.notification_count = 0;
    _.each($scope.activity, function(event) {
      event.unread = false;
    });
  };

  $scope.visit = function(event) {
    $analytics.eventTrack('Notifications: Clickthrough');
    if (event.unread) {
      Activity.save({id: event.id}, {unread: false});
      event.unread = false;
      currentUser.notification_count -= 1;
    }
    $scope.$state.go('post', {postId: event.post.id});
  };

  $scope.truncate = truncate;
  $scope.isEmpty = _.isEmpty;

  $scope.present = function(event) {
    var present = require('../../services/RichText').present,
      text = event.comment.comment_text || event.post.description;
    return present(text, {communityId: event.post.communities[0].id, maxlength: 200});
  }
};

module.exports = function(angularModule) {
  angularModule.controller('NotificationsCtrl', controller);
};
