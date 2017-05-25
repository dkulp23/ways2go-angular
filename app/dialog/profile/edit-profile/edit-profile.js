'use strict';

require('./_edit-profile.scss');

module.exports = {
  template: require('./edit-profile.html'),
  controller: ['$log', '$window', '$location', '$mdDialog', '$mdToast', 'profileService', EditProfileController],
  controllerAs: 'editProfileCtrl'
};

function EditProfileController($log, $window, $location, $mdDialog, $mdToast, profileService) {
  $log.debug('EditProfileController');

  this.isLoading = false;
  this.profile = {};

  this.updateProfile = function() {
    $log.debug('EditProfileController.updateProfile');
    $log.debug('profile', this.profile);
    this.isLoading = true;
    profileService.updateProfile(this.profile)
    .then( () => {
      $mdToast.showSimple('Your profile has been updated.');
      this.isLoading = false;
      $mdDialog.hide();
    })
    .catch( err => {
      $mdToast.showSimple(err.data);
      this.isLoading = true;
    });
  };

  this.deleteProfile = function() {
    $log.debug('DisplayProfileController.deleteProfile');

    this.isLoading = true;

    profileService.deleteProfile()
    .then( () => {
      $mdToast.showSimple('profile deleted')
      .then( () => {
        $location.url('/join');
        $mdDialog.hide();
      });
    })
    .catch( err => {
      $mdToast.showSimple(err.data);
    });
  };

  this.closeDialog = function() {
    $mdDialog.hide();
  };
}
