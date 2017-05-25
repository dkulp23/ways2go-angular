'use strict';

require('./_review-thumbnail.scss');

module.exports = {
  template: require('./review-thumbnail.html'),
  controller: ['$log', Reviewthumbnailontroller],
  controllerAs: 'reviewthumbnailCtrl',
  bindings: {
    reviews: '<'
  }
};

function Reviewthumbnailontroller($log) {
  $log.debug('Reviewthumbnailontroller');

}
