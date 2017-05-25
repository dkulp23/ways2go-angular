'use strict';

require('./_create-review.scss');

module.exports = {
  template: require('./create-review.html'),
  controller: ['$log', '$mdDialog', '$mdToast', 'profile', 'way', 'reviewService', CreateReviewController],
  controllerAs: 'createReviewCtrl'
};

function CreateReviewController($log, $mdDialog, $mdToast, profile, way, reviewService) {
  $log.debug('CreateReviewController');

  this.review = {};
  this.profile = profile;
  this.way = way;
  this.isLoading = false;

  this.submitReview = function() {
    $log.debug('CreateReivewController.submitReview');

    this.isLoading = true;

    reviewService.createReview(this.profile, this.way, this.review)
    .then( () => {
      $mdToast.showSimple('thanks. your opinion matters!')
      .then( () => {
        this.isLoading = false;
        $mdDialog.hide();
      });
    })
    .catch( err => {
      $mdToast.showSimple(err.data);
      this.isLoading = false;
    });
  };

  this.closeDialog = function() {
    $mdDialog.hide();
  };
}
