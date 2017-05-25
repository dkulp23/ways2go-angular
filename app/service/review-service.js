/* global angular __API_URL__ */
'use strict';

module.exports = ['$q', '$log', '$http', 'Upload', 'profileService', 'wayService', 'authService', '$rootScope', reviewService];

function reviewService($q, $log, $http, Upload, profileService, wayService, authService, $rootScope) {
  $log.debug('reviewService');

  let service = {};

  service.review = {};
  service.reviews = [];

  service.getReviews = function() {
    return service.reviews;
  };

  service.createReview = function(profile, way, review) {
    $log.debug('reviewService.createReview');

    review.wayID = way._id;

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/wayerz/${profile._id}/review`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      return $http.post(url, review, config);
    })
    .then( res => {
      $log.log('review creation success');
      let review = res.data;
      // service.reviews.unshift(review);
      return review;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.updateReview = function(review) {
    $log.debug('reviewService.updateReview');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/review/:id`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      return $http.put(url, review, config);
    })
    .then( res => {
      $log.log('review edit success');
      this.review = res.data;
      $log.log(this.review);
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.fetchReviews = function(profile) {
    $log.debug('reviewService.fetchReviews');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/wayerz/${profile._id}/review`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      return $http.get(url, config);
    })
    .then( res => {
      $log.log('review retrieved');
      angular.copy(res.data, service.reviews);
      return res.data;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  $rootScope.$on('logout', () => {
    service.review = {};
    service.reviews = [];
  });

  return service;
}
