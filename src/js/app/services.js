module.exports = function (angularModule) {
  // FIXME don't do modules like this anymore;
  // instead just export the factory function
  // as in the second section below
  require('./services/Community')(angularModule)
  require('./services/Tool')(angularModule)
  require('./services/UseOfTool')(angularModule)
  require('./services/Activity')(angularModule)
  require('./services/Search')(angularModule)
  require('./services/Invitation')(angularModule)
  require('./services/Network')(angularModule)
  require('./services/bodyClass')(angularModule)
  require('./services/history')(angularModule)
  require('./services/dialog')(angularModule)
  require('./services/Cache')(angularModule)
  require('./services/UserCache')(angularModule)
  require('./services/ThirdPartyAuth')(angularModule)
  require('./services/removeTrailingSlash')(angularModule)
  require('./services/myHttpInterceptor')(angularModule)
  require('./services/GooglePicker')(angularModule)
  require('./services/joinCommunity')(angularModule)
  require('./services/popupDone')

  angularModule
  .factory('CurrentUser', require('./services/CurrentUser'))
  .factory('User', require('./services/User'))
  .factory('UserMentions', require('./services/UserMentions'))
  .factory('ModalLoginSignup', require('./services/ModalLoginSignup'))
}
