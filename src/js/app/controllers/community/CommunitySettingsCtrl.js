var filepickerUpload = require('../../services/filepickerUpload');

var controller = function ($scope, $history, community, currentUser, growl, tools, extraProperties, User, UseOfTool, $location) {

  _.merge(community, extraProperties);
  var origin = $location.absUrl().replace($location.path(), '');
  $scope.join_url = origin + '/c/' + community.slug + '/join/' + community.beta_access_code;
  $scope.community = community;
  $scope.settings = community.settings;
  $scope.tools = tools.tools;
  $scope.availableTools = tools.available_tools.filter(function (t) {
    return !_.find(tools.tools, function (inner) { return parseInt(inner.tool_id) === t.id; });
  })

  if ($location.$$search.tools === "1") {
    $scope.expand4 = true;
  }
  if ($location.$$search.new === "1") {
    $scope.new = true;
  }

  $scope.toolDisplayUrl = UseOfTool.toolDisplayUrl;

  $scope.close = function() {
    if ($history.isEmpty()) {
      $scope.$state.go('community.members', {community: community.slug});
    } else {
      $history.back();
    }
  };

  $scope.removeSlug = function (string) {
    return string.replace(':slug', '');
  }

  $scope.editing = {
    tools: $scope.tools.map(() => { return false; }),
    addTools: $scope.availableTools.map(() => { return false; })
  };
  $scope.edited = {
    tools: _.clone($scope.tools),
    addTools: $scope.availableTools.map(function (availableTool) {
      return { tool_id: availableTool.id, community_id: community.id, slug: "" };
    })
  };

  console.log($scope.edited.addTools);

  $scope.edit = function(field, field2) {
    $scope.edited[field] = community[field];
    $scope.editing[field] = true;

    if (field2) {
      $scope.edited[field2] = community[field2];
      $scope.editing[field2] = true;
    }
  };

  $scope.cancelEdit = function(field, field2) {
    $scope.editing[field] = false;

    if (field2) {
      $scope.editing[field2] = false;
    }
  };

  $scope.saveEdit = function(field, field2) {
    $scope.editing[field] = false;
    var data = {};

    data[field] = $scope.edited[field];

    if (field2 === 'leader') {
      data.leader_id = $scope.edited.leader.id;
    }

    community.update(data, function() {
      community[field] = $scope.edited[field];
      if (field2) {
        community[field2] = $scope.edited[field2];
      }
      $scope.join_url = origin + '/c/' + community.slug + '/join/' + community.beta_access_code;
    });
  };

  var imageChangeFn = function(opts) {
    return function() {
      $scope.editing[opts.fieldName] = true;
      filepickerUpload({
        path: opts.path,
        convert: opts.convert,
        success: function(url) {
          var data = {id: community.id};
          data[opts.fieldName] = url;
          community.update(data, function() {
            community[opts.fieldName] = url;
            $scope.editing[opts.fieldName] = false;
          });
        },
        failure: function(error) {
          $scope.editing[opts.fieldName] = false;
          $scope.$apply();
          if (error.code == 101) return;

          growl.addErrorMessage('An error occurred while uploading the image. Please try again.');
        }
      });
    };
  };

  $scope.changeIcon = imageChangeFn(community.avatarUploadSettings());

  $scope.toggleModerators = function() {
    $scope.expand3 = !$scope.expand3;
    if (!$scope.moderators) {
      $scope.moderators = community.moderators();
    }
  };

  $scope.toggleTools = function() {
    $scope.expand4 = !$scope.expand4;
  };

  $scope.saveSetting = function(name) {
    community.update({settings: community.settings}, function() {
      growl.addSuccessMessage('Changes were saved.');
    });
  };

  $scope.removeModerator = function(userId) {
    var user = _.find($scope.moderators, function(user) { return user.id == userId }),
      confirmText = "Are you sure you wish to remove " + user.name + "'s moderator powers?";

    if (confirm(confirmText)) {
      community.removeModerator({userId: userId}, function() {
        $scope.moderators = $scope.moderators.filter(function(user) {
          return user.id != userId;
        });
      });
    }
  };

  $scope.findMembers = function(search) {
    return User.autocomplete({q: search, communityId: community.id}).$promise;
  };

  $scope.addModerator = function(item, model, label) {
    $scope.selectedMember = null;
    community.addModerator({userId: item.id}, function() {
      $scope.moderators.push(item);
    })
  };

  $scope.removeTool = function(index) {
    var tool = $scope.tools[index],
      confirmText = "Are you sure you wish to remove the tool " + tool.tool.name + "?";

    if (confirm(confirmText)) {
      community.removeTool({id: tool.id}, function() {
        $scope.availableTools.push(tool.tool);
        $scope.tools = $scope.tools.filter(function(innerTool) {
          return innerTool.id != tool.id;
        });
      });
    }
  };

  $scope.setLeader = function(item) {
    $scope.edited.leader = item;
  };

  $scope.editTool = function(index) {
    $scope.edited.tools[index] = _.clone($scope.tools[index]);
    $scope.editing.tools[index] = true;
  };

  $scope.cancelToolEdit = function(index) {
    $scope.editing.tools[index] = false;
  };

  $scope.saveToolEdit = function(index) {
    $scope.editing.tools[index] = false;
    var data = {
      id: $scope.edited.tools[index].id,
      slug: $scope.edited.tools[index].slug
    };
    community.updateTool(data, function() {
      $scope.tools[index] = $scope.edited.tools[index];
    });
  };

  $scope.startAddTool = function(index) {
    $scope.editing.addTools[index] = true;
  };

  $scope.cancelAddTool = function(index) {
    $scope.editing.addTools[index] = false;
  };

  $scope.finishAddTool = function(index) {
    $scope.editing.addTools[index] = false;
    var data = {
      tool_id: $scope.edited.addTools[index].tool_id,
      slug: $scope.edited.addTools[index].slug
    };
    community.addTool(data, function() {
      $scope.tools.push({
        slug: data.slug,
        tool_id: data.tool_id,
        community_id: $scope.edited.addTools[index].community_id,
        tool: _.clone($scope.availableTools[index])
      });
      $scope.edited.addTools.splice(index, 1);
      $scope.availableTools.splice(index, 1);
    });
  };
};

module.exports = function(angularModule) {
  angularModule.controller("CommunitySettingsCtrl", controller);
};
