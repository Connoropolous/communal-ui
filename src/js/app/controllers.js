var angularModule = angular.module('hyloControllers', [])

require('./controllers/profile')(angularModule)
require('./controllers/user/NotificationsCtrl')(angularModule)

require('./controllers/community/CommunityCtrl')(angularModule)
require('./controllers/community/CommunitySettingsCtrl')(angularModule)
require('./controllers/community/CommunityMembersCtrl')(angularModule)
require('./controllers/community/CommunityToolsCtrl')(angularModule)
require('./controllers/community/CommunityInviteCtrl')(angularModule)
require('./controllers/community/NewCommunityCtrl')(angularModule)

require('./controllers/AnnouncerCtrl')(angularModule)
require('./controllers/SearchCtrl')(angularModule)
require('./controllers/FulfillmentCtrl')(angularModule)
require('./controllers/user/ForgotPasswordCtrl')(angularModule)

angularModule
.controller('NavCtrl', require('./controllers/NavCtrl'))

.controller('JoinCommunityCtrl', require('./controllers/community/JoinCommunityCtrl'))
.controller('JoinCommunityByUrlCtrl', require('./controllers/community/JoinCommunityByUrlCtrl'))

.controller('ProfileEditCtrl', require('./controllers/profile/ProfileEditCtrl'))

.controller('LoginCtrl', require('./controllers/user/LoginCtrl'))
.controller('SignupCtrl', require('./controllers/user/SignupCtrl'))
.controller('UserSettingsCtrl', require('./controllers/user/UserSettingsCtrl'))
