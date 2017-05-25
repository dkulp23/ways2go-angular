'use strict';

require('./_landing.scss');

const createUserComponent = require('../../dialog/user/create-user/create-user.js');

const signinUserComponent = require('../../dialog/user/signin/signin.js');

module.exports = ['$log', '$rootScope', '$mdDialog', '$location', '$mdMedia', '$scope', LandingController];

function LandingController($log, $rootScope, $mdDialog, $location, $mdMedia, $scope) {
  $log.debug('LandingController');

  this.signup = function($event, bindFlag) {
    const dialogConfig = {
      fullscreen: !$mdMedia('gt-sm'),
      targetEvent: $event,
      scope: $scope.$new(bindFlag)
    };
    $mdDialog.show(Object.assign(createUserComponent, dialogConfig));
  };

  this.signin = function($event, bindFlag) {
    const dialogConfig = {
      fullscreen: !$mdMedia('gt-sm'),
      targetEvent: $event,
      scope: $scope.$new(bindFlag)
    };
    $mdDialog.show(Object.assign(signinUserComponent, dialogConfig));
  };
}
