var service = function($resource) {
  var Tool = $resource('/noo/tools/:id', {
    id: '@id'
  }, {
    create: {
      method: 'POST',
      url: '/noo/tool'
    },
    show: {
      method: 'GET',
      url: '/noo/tool/:id'
    },
    update: {
      method: 'POST',
      url: '/noo/tool/:id'
    },
    destroy: {
      method: 'DELETE',
      url: '/noo/tool/:id'
    }
  });

  // let's make things a bit more OO around here
  /*_.extend(Tool.prototype, {

  });*/

  return Tool;
};

module.exports = function(angularModule) {
  angularModule.factory('Tool', service);
};
