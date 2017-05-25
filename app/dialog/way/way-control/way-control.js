'use strict';

require('./_way-control.scss');

module.exports = {
  template: require('./way-control.html'),
  controller: ['$log', '$mdDialog', '$mdToast','$scope', '$mdMedia', WayControlController],
  controllerAs: 'wayControlCtrl'
};

function WayControlController($log, $mdDialog, $mdToast,$scope, $mdMedia) {

  console.log('this in way control', this);

  this.createWay = function ($event, bindFlag) {
    const dialogConfig = {
      fullscreen: !$mdMedia('gt-sm'),
      targetEvent: $event,
      scope: 'wayCtrl'
    };
    $mdDialog.show(Object.assign(createWayComponent, dialogConfig));
  };

}
