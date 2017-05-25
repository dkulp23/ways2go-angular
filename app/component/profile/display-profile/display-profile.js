'use strict';

require('./_display-profile.scss');

const editProfileComponent = require('../../../dialog/profile/edit-profile/edit-profile.js');

module.exports = {
  template: require('./display-profile.html'),
  controller: ['$log', '$mdToast', '$mdSidenav', '$rootScope', '$scope', '$mdMedia', '$mdDialog', '$location', '$window', 'profileService', 'reviewService', DisplayProfileController],
  controllerAs: 'displayProfileCtrl',
  bindings: {
    profile: '<'
  }
};

function DisplayProfileController($log, $mdToast, $mdSidenav, $rootScope, $scope, $mdMedia, $mdDialog, $location, $window, profileService, reviewService) {
  $log.debug('DisplayProfileController');

  this.$onInit = () => {
    profileService.getProfile()
    .then( profile => {
      this.profile = profile;
    });
    this.calcAvgReview(this.profile);
  };

  this.calcAvgReview = function(profile) {
    $log.debug('DisplayProfileController.avgReview');

    return reviewService.fetchReviews(profile)
    .then( reviews => {
      let sum = reviews.reduce((acc, ele) => {
        return acc + ele['rating'];
      }, 0);
      let avg = sum / reviews.length;
      this.avgReview = avg;
    })
    .catch( err => {
      $mdToast.showSimple(err.data);
    });
  };

  this.editProfile = function(bindFlag) {
    const dialogConfig = {
      fullscreen: !$mdMedia('gt-sm'),
      scope: $scope.$new(bindFlag)
    };

    $mdDialog.show(Object.assign(editProfileComponent, dialogConfig));
  };

  this.closeProfile = function() {
    $mdSidenav('left').close();
  };

  this.linkMediaSite = function(site, user) {
    return $window.open(`https://www.${site}.com/${user}`, '_blank');
  };

  this.linkGoogle = function(user) {
    return $window.open(`https://www.plus.google.com/${user}`, '_blank');
  };

  this.linkedIn = function(user) {
    return $window.open(`https://www.linkedin.com/in/${user}`, '_blank');
  };
  this.isOpen = false;
}
