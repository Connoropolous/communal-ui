var service = function($resource) {
  var UseOfTool = $resource('/noo/community/:communityId/tools/:id', {
    id: '@id'
  }, {
    create: {
      method: 'POST',
      url: '/noo/community/:communityId/tools'
    },
    show: {
      method: 'GET',
      url: '/noo/community/:communityId/tools/:id'
    },
    update: {
      method: 'POST',
      url: '/noo/community/:communityId/tools/:id'
    },
    destroy: {
      method: 'DELETE',
      url: '/noo/community/:communityId/tools/:id'
    }
  });

  // let's make things a bit more OO around here
  _.extend(UseOfTool.prototype, {
    update: function (params, success, error) {
      return UseOfTool.save(_.extend({id: this.id}, params), success, error)
    }
  });

  UseOfTool.toolDisplayUrl = function (tool) {
    return tool.tool.url.replace(':slug', tool.slug);
  };

  UseOfTool.launchTool = function (tool) {
    var win = window.open(UseOfTool.toolDisplayUrl(tool), '_blank');
    win.focus();
  };

  UseOfTool.requestAccessToTool = function (communityId, toolId) {

  };

  return UseOfTool;
};

module.exports = function(angularModule) {
  angularModule.factory('UseOfTool', service);
};
