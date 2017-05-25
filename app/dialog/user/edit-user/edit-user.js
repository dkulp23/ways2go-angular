'use strict';

require('./_edit-user.scss');

module.exports = {
  template: require('./edit-user.html'),
  controller: ['$log', '$window', '$location', '$mdDialog','$mdToast', 'authService', EditUserController],
  controllerAs: 'editUserCtrl'
};

function EditUserController($log, $window, $location, $mdDialog, $mdToast, authService) {
  $log.debug('EditUserController');

  this.isLoading = false;
  this.isAuthorized = false;
  this.user = {};

  if ($window.token) {
    authService.getToken()
    .then( () => {
      $location.url('/home');
    });
  }

  this.editUser = function() {
    $log.debug('EditUserController.editUser');

    this.isLoading = true;
    authService.updateUser(this.user)
    .then( () => {
      let updates = Object.keys(this.user);
      updates.forEach(function(ele) {
        $mdToast.showSimple(`Your ${ele} has been updated`);
      });
      this.isLoading = false;
      this.isAuthorized = true;
    })
    .catch( err => {
      $mdToast.showSimple(err.data);
      this.isLoading = false;
    });
  };

  this.deleteUser = function() {
    $log.debug('SigninController.deleteUser');

    this.isLoading = true;

    authService.deleteUser()
    .then( () => {
      $mdToast.showSimple('user account info removed')
      .then( () => {
        $location.url('/join');
        $mdDialog.hide();
      });
    })
    .catch( err => {
      $mdToast.showSimple(err.data);
    });
  };

  this.goHome = function() {
    $location.url('/home');
    $mdDialog.hide();
  };

  this.closeDialog = function() {
    $mdDialog.hide();
  };
}
