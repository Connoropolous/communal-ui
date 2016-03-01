var config = function ($httpProvider) {
  $httpProvider.interceptors.push(function ($q, growl) {
    return {
      responseError: function(rejection) {
        if (!_.include([401, 403, 422, 0], rejection.status)) {
          var message = format('Oops! An error occurred. The Hylo team has been notified. (%s)', rejection.status);
          growl.addErrorMessage(message, {ttl: 5000});
        }

        if (rejection.status === 0) {
          growl.addErrorMessage("Oops! Your request timed out. Please check your network connection and try again.", {ttl: 5000});
        }

        return $q.reject(rejection);
      }
    };
  });
};

module.exports = function (angularModule) {
  angularModule.config(config);
};
