module.exports = function ($resource, $state, $timeout, $q) {
  'ngInject'

  var User = $resource('/noo/user/:id', {
    id: '@id'
  }, {
    current: {
      url: '/noo/user/me'
    },
    login: {
      url: '/noo/login',
      method: 'POST'
    },
    signup: {
      url: '/noo/user',
      method: 'POST'
    },
    status: {
      url: '/noo/user/status'
    },
    requestPasswordChange: {
      url: '/noo/user/password',
      method: 'POST'
    },
    autocomplete: {
      url: '/noo/autocomplete',
      isArray: true,
      params: {
        type: 'people'
      }
    },
    queryForNetwork: {
      url: '/noo/network/:id/members'
    }
  })

  // load this as a "resolve" dependency for a route.
  // if the route has children with resolve dependencies
  // that call resources requiring login,
  // add it as a dependency of those.
  // (see e.g. routes/home.js)
  User.requireLogin = function (user, redirectState, code, slug) {
    if (user) return

    var nextParams = {code: code, slug: slug, next: format('%s%s', window.location.pathname, window.location.search)}
    if (!redirectState) redirectState = 'login'

    $timeout(() => $state.go(redirectState, nextParams))
    var deferred = $q.defer()
    deferred.reject('login required') // this string is expected in app/index.js
    return deferred.promise
  }

  // let's make things a bit more OO around here
  _.extend(User.prototype, {
    update: function (params, success, error) {
      return User.save(_.extend({id: this.id}, params), success, error)
    },
    firstName: function () {
      return this.name.split(' ')[0]
    },
    canModerate: function (community) {
      return this.is_admin ||
        !!_.find(this.memberships, m => m.community.id === community.id && m.role === 1)
    },
    inCommunity: function () {
      return !_.isEmpty(this.memberships)
    },
    lastUsedMembership: function () {
      var reverseDate = m => -Date.parse(m.last_viewed_at || '2001-01-01')
      return _.sortBy(this.memberships, reverseDate)[0]
    }
  })

  return User
}
