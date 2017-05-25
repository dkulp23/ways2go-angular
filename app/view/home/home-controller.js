'use strict';

require('./_home.scss');

module.exports = ['$log', '$rootScope', '$mdToast', 'reviewService', 'profile', 'ways', HomeController]; //TODO: Add service dependencies

function HomeController($log, $rootScope, $mdToast, reviewService, profile, ways) {
  $log.debug('HomeContoller');

  this.profile = profile;
  this.ways = ways;

  this.$onInit = () => {
    $log.debug('home init this', this);

    reviewService.fetchReviews(this.profile)
    .then( reviews => {
      this.reviews = reviews;
    });
  };
  $log.debug('home this', this);
}
