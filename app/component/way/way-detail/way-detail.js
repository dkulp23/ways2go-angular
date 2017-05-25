/* global */

'use strict';

require('./_way-detail.scss');

const viewWayComponent = require('../../../dialog/way/view-way/view-way.js');

module.exports = {
  template: require('./way-detail.html'),
  controller: ['$log', '$http', '$interval', 'NgMap', 'wayService', '$mdMedia', '$scope', '$mdDialog', 'profileService', WayDetailController],
  controllerAs: 'wayDetailCtrl',
  bindings: {
    ways: '<',
  }
};

function WayDetailController($log, $http, $interval, NgMap, wayService, $mdMedia, $scope, $mdDialog, profileService) {
  $log.debug('WayDetailController');

  profileService.fetchProfile()
  .then( profile => {
    this.profile = profile;
  });

  console.log('this up in way detail', this);
  console.log('this ways up in way detail', this.ways);

  this.viewWay = function ($event, bindFlag, way) {
    const dialogConfig = {
      fullscreen: !$mdMedia('gt-sm'),
      targetEvent: $event,
      resolve: {
        way: function() {
          return way;
        }
      },
    };
    $mdDialog.show(Object.assign(viewWayComponent, dialogConfig));
  };
}
