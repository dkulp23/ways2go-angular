/* global angular __API_URL__ */
'use strict';

module.exports = ['$q', '$log', '$http', 'authService', wayService];

function wayService($q, $log, $http, authService) {
  $log.debug('wayService');

  let service = {};
  service.ways = [];
  service.waysFetchFlag = false;

  service.createWay = function(way) {
    $log.debug('wayService.createWay');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/way`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };


      return $http.post(url, way, config);
    })
    .then( res => {
      $log.log('way created');
      let way = res.data;
      service.ways.unshift(way);
      return res.data;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.editWay = function(way) {
    $log.debug('wayService.editWay');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/way/${way._id}`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      return $http.put(url, way, config);
    })
    .then( res => {
      angular.copy(res.data, service.getOneWay(res.data._id));
      $log.log('way edited', res.data);
      let way = res.data;
      return way;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.fetchWays = function() {
    $log.debug('wayService.fetchWays');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/way`;
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
      $log.log('ways fetched');
      service.waysFetchFlag = true;
      angular.copy(res.data, service.ways);
      return service.ways;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.deleteWay = function(wayID) {
    $log.debug('wayService.deleteWay');


    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/way/${wayID}`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      return $http.delete(url, config);
    })
    .then( res => {
      $log.debug('way deleted');
      service.ways.splice(service.ways.map( way => way._id).indexOf(wayID),1);
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.getWays = function() {
    $log.log('wayService.getWays');
    return service.ways;
  };

  service.getOneWay = function(wayID) {
    $log.log('wayService.getOneWay');

    for (let w in service.ways) {
      if (service.ways[w]._id === wayID) {
        return service.ways[w];
      }
    }
    return;
  };

  service.addWayer = function(wayID, wayerID) {
    $log.debug('wayService.addWayer');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/way/${wayID}/wayerz/${wayerID}`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };


      return $http.post(url, null, config);
    })
    .then( res => {
      $log.log('wayer added', res.data);
      let wayUpdate = service.getOneWay(res.data._id);
      angular.copy(res.data.wayerz, wayUpdate.wayerz);
      return res.data;
    })
    .catch( err => {
      return $q.reject(err);
    });
  };

  service.deleteWayer = function(wayID, wayerID) {
    $log.debug('wayService.deleteWayer');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/way/${wayID}/wayerz/${wayerID}`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };


      return $http.delete(url, config);
    })
    .then( res => {
      $log.log('wayer deleted', res.data);
      let wayUpdate = service.getOneWay(res.data._id);
      angular.copy(res.data.wayerz, wayUpdate.wayerz);
      return res.data;
    })
    .catch( err => {
      return $q.reject(err);
    });
  };


  return service;
}
