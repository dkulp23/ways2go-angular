/* global google */
'use strict';

require('./_waymap.scss');

const viewWayComponent = require('../../../dialog/way/view-way/view-way.js');

module.exports = {
  template: require('./waymap.html'),
  controller: ['$log', '$http', '$interval', 'NgMap', 'wayService', '$mdMedia', '$scope', '$mdDialog', 'profileService', WayMapController],
  controllerAs: 'wayMapCtrl',
  bindings: {
    ways: '<'
  }
};

function WayMapController($log, $http, $interval, NgMap, wayService, $mdMedia, $scope, $mdDialog, profileService) {
  $log.debug('WayMapController');

  this.$onInit = () => {
    console.log('waymap oninit this', this);
    profileService.fetchProfile()
    .then( profile => {
      this.profile = profile;

      this.centerOnLoad = [ Number(this.profile.address[0].lat), Number(this.profile.address[0].lng)];

      this.startMarkers = [];
      this.endMarkers = [];
      this.googlePaths = [];

      const drawWays = () => {
        console.log('up in draw ways');
        NgMap.getMap().then( map => {

          this.startMarkers.forEach( marker => marker.setMap(null));
          this.endMarkers.forEach( marker => marker.setMap(null));
          this.googlePaths.forEach( path => path.setMap(null));
          this.startMarkers = [];
          this.endMarkers = [];
          this.googlePaths = [];

          this.ways.forEach( way => {

            let startPos = new google.maps.LatLng(Number(way.startLocation.lat), Number(way.startLocation.lng));
            let endPos = new google.maps.LatLng(Number(way.endLocation.lat), Number(way.endLocation.lng));

            let startMarkerSVG = `data:image/svg+xml;utf-8, \
            <svg width="24" height="24" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"> \
            <circle cx="12" cy="12" r="11" fill="green" stroke="black" stroke-width="2"/>\
            </svg>`;

            let endMarkerSVG = `data:image/svg+xml;utf-8, \
            <svg width="24" height="24" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"> \
            <path fill="red" stroke="white" stroke-width="2" d="M0 8L0 16L8 24L16 24L24 16L24 8L16 0L8 0z" ></path> \
            </svg>`;



            let startMarker = new google.maps.Marker({
              map: map,
              position: startPos,
              icon:{
                anchor: new google.maps.Point(12, 12),
                url: startMarkerSVG,
              },
              wayID: way._id,
              zIndex: 1

            });

            let endMarker = new google.maps.Marker({
              map: map,
              position: endPos,
              icon:{
                anchor: new google.maps.Point(12, 12),
                url: endMarkerSVG,
              },
              wayID: way._id,
              zIndex: 1
            });


            let waypath = [
              {
                lat: Number(way.startLocation.lat),
                lng: Number(way.startLocation.lng)
              },
              {
                lat: Number(way.endLocation.lat),
                lng: Number(way.endLocation.lng)
              }
            ];

            let dash = {
              path: 'M -1,1 0,-1 1,1',
              strokeOpacity: 1,
              scale: 3
            };

            let color = '';
            if (way.profileID === this.profile._id) {
              color = '#0D47A1';
            } else color = '#757575';

            let googlePath = new google.maps.Polyline({
              map: map,
              path: waypath,
              geodesic: true,
              strokeColor: color,
              strokeOpacity: 0,
              icons: [{
                icon: dash,
                offset: '0',
                repeat: '15px'
              }],
              wayID: way._id
            });

            this.startMarkers.push(startMarker);
            this.endMarkers.push(endMarker);
            this.googlePaths.push(googlePath);

            google.maps.event.addListener(startMarker, 'click', function() {
              let _way = wayService.getOneWay(this.wayID);

              viewWay(event, true, _way); // eslint-disable-line
            });

            google.maps.event.addListener(endMarker, 'click', function() {
              let _way = wayService.getOneWay(this.wayID);

              viewWay(event, true, _way); // eslint-disable-line
            });

            google.maps.event.addListener(googlePath, 'click', function() {
              let _way = wayService.getOneWay(this.wayID);

              viewWay(event, true, _way); // eslint-disable-line
            });
          });

          // let myLastWay = this.ways.filter( way => way.profileID === this.profile._id)[0];
          // console.log('last way', myLastWay);
          // let myLastStartPos = new
          // google.maps.LatLng(Number(myLastWay.startLocation.lat), Number(myLastWay.startLocation.lng));
          // let myLastEndPos = new google.maps.LatLng(Number(myLastWay.endLocation.lat), Number(myLastWay.endLocation.lng));
          //
          // console.log(myLastStartPos);
          // console.log(myLastEndPos);
          //
          // let bounds = new google.maps.LatLngBounds();
          // bounds.extend(myLastStartPos);
          // bounds.extend(myLastEndPos);
          // map.fitBounds(bounds);
        });
      };

      //map data
      this.mapInit = () => {
        console.log('reg mapinit this', this);
        NgMap.getMap().then( map => {
          this.isMapInitialized = true;
          this.map = map;

          drawWays();
          let homeMarkerSVG = `data:image/svg+xml;utf-8, \
          <svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> \
          <path fill="#CDDC39" stroke="#2196F3" stroke-width="2px" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path> \
          </svg>`;
          var homeMarker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(Number(this.profile.address[0].lat), Number(this.profile.address[0].lng)),
            icon:{
              anchor: new google.maps.Point(12, 12),
              url: homeMarkerSVG,
            },
            animation: google.maps.Animation.DROP,
            zIndex: 10
          });

          this.map.setCenter(new google.maps.LatLng(Number(this.profile.address[0].lat), Number(this.profile.address[0].lng)));
        });
      };

      const viewWay = function ($event, bindFlag, way) {
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

      $scope.$on('wayChange', () => {
        $log.debug('waychange broadcast');

        drawWays();
      });
    });
  };
}
