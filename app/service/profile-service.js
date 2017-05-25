/*   global angular __API_URL__ */
'use strict';

module.exports = ['$q', '$log', '$http', '$mdSidenav', 'Upload', 'authService', '$rootScope', profileService];

function profileService($q, $log, $http, $mdSidenav, Upload, authService, $rootScope) {
  $log.debug('profileService');

  let service = {};
  service.profile = {};
  service.messageProfile = {};
  service.allProfiles = [];

  service.toggleProfile = function() {
    $mdSidenav('left').toggle();
  };

  service.getProfile = function() {
    return $q.resolve(service.profile);
  };

  service.createProfile = function(profile) {
    $log.debug('profileService.createProfile');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile`;
      let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      if (profile.socialMedia) {
        let data = {
          displayName: profile.displayName,
          fullName: profile.fullName,
          address: profile.address,
          bio: profile.bio,
          photo: profile.photo,
          ['socialMedia.twitter']: profile.socialMedia.twitter || null,
          ['socialMedia.facebook']: profile.socialMedia.facebook || null,
          ['socialMedia.googlePlus']: profile.socialMedia.googlePlus || null,
          ['socialMedia.linkedIn']: profile.socialMedia.linkedIn || null
        };

        return Upload.upload({
          url,
          headers,
          method: 'POST',
          data: data
        });
      }

      return Upload.upload({
        url,
        headers,
        method: 'POST',
        data: {
          displayName: profile.displayName,
          fullName: profile.fullName,
          address: profile.address,
          bio: profile.bio,
          photo: profile.photo
        }
      });
    })
    .then( res => {
      $log.log('profile creation success');
      angular.copy(res.data, service.profile);
      return service.profile;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.updateProfile = function(profile) {
    $log.debug('profileService.updateProfile');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile`;
      $log.debug('update profile', profile);
      let headers = {
        Authorization: `Bearer ${token}`
      };

      if (profile.socialMedia) {
        let data = {
          displayName: profile.displayName,
          fullName: profile.fullName,
          address: profile.address,
          bio: profile.bio,
          photo: profile.photo,
          ['socialMedia.twitter']: profile.socialMedia.twitter,
          ['socialMedia.facebook']: profile.socialMedia.facebook,
          ['socialMedia.googlePlus']: profile.socialMedia.googlePlus,
          ['socialMedia.linkedIn']: profile.socialMedia.linkedIn
        };

        return Upload.upload({
          url,
          headers,
          method: 'PUT',
          data: data
        });
      }

      return Upload.upload({
        url,
        headers,
        method: 'PUT',
        data: {
          displayName: profile.displayName,
          fullName: profile.fullName,
          address: profile.address,
          bio: profile.bio,
          photo: profile.photo
        }
      });
    })
    .then( res => {
      $log.log('profile updated successfully');
      angular.copy(res.data, service.profile);
      return service.profile;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.fetchProfile = function() {
    $log.debug('profileService.fetchProfile');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile/user`;

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
      $log.log('profile retrieved');
      service.fetchProfileFlag = true;
      angular.copy(res.data, service.profile);
      return service.profile;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.fetchProfileByID = function(profileID) {
    $log.debug('profileService.updateProfile');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile/${profileID}`;
      let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      return $http.get(url, {headers: headers});

    })
    .then( res => {
      $log.log('profile retrieved');
      angular.copy(res.data, service.messageProfile);
      return res.data;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.deleteProfile = function() {
    $log.debug('profileService.deleteProfile');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile`;
      let config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      return $http.delete(url, config);
    })
    .then( res => {
      $log.log(res.status);
      return res.status;
      // for (var key of service.profile) {
      //   delete service.profile[key];
      // }
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.fetchAllProfiles = function(){
    $log.debug('profileService.fetchAllProfiles');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile`;

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
      $log.log('all profiles retrieved');
      service.allProfiles = res.data;
      return service.allProfiles;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  $rootScope.$on('logout', function() {
    service.profile = {};
    service.messageProfile = {};
    service.allProfiles = [];
  });

  return service;
}
