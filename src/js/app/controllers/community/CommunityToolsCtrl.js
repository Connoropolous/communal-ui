var controller = function($scope, community, toolsQuery, $dialog, Cache, currentUser, Tool, UseOfTool, $timeout) {
  $scope.tools = toolsQuery.tools;
  $scope.toolCount = toolsQuery.tools_total;

  $scope.toolDisplayUrl = UseOfTool.toolDisplayUrl;
  $scope.launchTool = UseOfTool.launchTool;
  $scope.requestAccessToTool = UseOfTool.requestAccessToTool;

  /*    var new_tool = $scope.new_tool = {
    slug: '39',
    tool_id: '4'
  };
  community.addTool(new_tool, function (response) {
    console.log(response);
  });*/
  /*var new_tool = new Tool({
    name: 'Cobudget',
    url: 'http://beta.cobudget.co/#/groups/:slug',
    avatar_url: 'https://pbs.twimg.com/profile_images/535182261553876992/MV2TWTgd.png',
    description: 'Collaborative Budgeting'
  });
  Tool.save(new_tool, function (response) {
    console.log(response);
  });*/

};

module.exports = function(angularModule) {
  angularModule.controller('CommunityToolsCtrl', controller);
};
