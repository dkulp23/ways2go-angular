'use strict';

require('./_way-thumbnail.scss');

module.exports = {
  template: require('./way-thumbnail.html'),
  controller: ['$log', WayThumbnailController],
  controllerAs: 'waythumbnailCtrl',
  bindings: {
    ways: '<'
  }
};

function WayThumbnailController($log) { // eslint-line-disable
  $log.debug('WayThumbnailController');

}
