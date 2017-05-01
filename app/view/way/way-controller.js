/* global angular google */

'use strict';

require('./_way.scss');

const createWayComponent = require('../../dialog/way/create-way/create-way.js');
const editWayComponent = require('../../dialog/way/edit-way/edit-way.js');

module.exports = ['$log', '$rootScope', '$mdDialog', 'wayService', '$http', '$interval', 'NgMap', '$mdMedia', '$scope', 'myProfile', WayController];

function WayController($log, $rootScope, $mdDialog, wayService, $http, $interval, NgMap, $mdMedia, $scope, myProfile) {
  $log.debug('WayController');

  this.ways = wayService.getWays();
  this.mapView = true;
  this.searchLocation = myProfile.address[0];
  this.searchRadius = 50;
  NgMap.getMap()
  .then( map => this.map = map);

  this.createDistanceWays = function createDistanceWays() {
    $log.debug('WayDetailController createDistanceWays()');
    console.log('WayDetailController createDistanceWays()');

    const meterToMile = 0.000621371;
    this.distanceWays = this.ways.map( way => Object.assign(way, {distance: this.computeWayDistance(way) * meterToMile}));
  };

  this.computeWayDistance = (way) => {
    return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(Number(way.startLocation.lat), Number(way.startLocation.lng)),
      new google.maps.LatLng(Number(this.searchLocation.lat), Number(this.searchLocation.lng))
    );
  };

  this.$onInit = () => {
    this.createDistanceWays();
  };

  // search bar
  this.type = 'geocode';
  this.placeChanged = function() {
    // "this" inside function references the location entered in from the search bar

    setPlaceChange(this.getPlace());
  };
  const setPlaceChange = (place) => {
    this.place = place;
    this.map.setCenter(this.place.geometry.location);
    this.map.setZoom(13);

    var {
      lat,
      lng
    } = this.place.geometry.location;

    angular.copy({
      lat: lat(),
      lng: lng()
    }, this.searchLocation);

    this.createDistanceWays();
    // $scope.$broadcast('searchChange');
  };



  this.createWay = function ($event, bindFlag) {
    const dialogConfig = {
      fullscreen: !$mdMedia('gt-sm'),
      targetEvent: $event,
      scope: $scope.$new(bindFlag)
    };
    $mdDialog.show(Object.assign(createWayComponent, dialogConfig));
  };

  this.editWay = function ($event, bindFlag) {
    const dialogConfig = {
      fullscreen: !$mdMedia('gt-sm'),
      targetEvent: $event,
      scope: $scope.$new(bindFlag)
    };
    $mdDialog.show(Object.assign(editWayComponent, dialogConfig));
  };

  this.fetchWays = function() {
    wayService.fetchWays()
    .then( ways => {
    })
    .catch( err => {
      $log.error(err);
    });
  };

  this.deleteWay = function(way) {
    wayService.deleteWay(way)
    .then( () => {
    })
    .catch( err => {
      $log.error(err);
    });
  };

  this.toggleView = function() {
    this.mapView = !this.mapView;

  };

  $scope.$watch('wayCtrl.ways', function(newValue, oldValue, scope) {
    $scope.$broadcast('wayChange');
    $scope.$broadcast('searchChange');
  }, true);

  $scope.$on('wayModify', function() {
    console.log('waymodify detected');
    $scope.$broadcast('wayChange');
    $scope.$broadcast('searchChange');
  });

}
