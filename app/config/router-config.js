'use strict';

module.exports = ['$stateProvider', '$urlRouterProvider', routerConfig];

function routerConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('', '/join#signup');
  $urlRouterProvider.when('/', '/join#signup');
  $urlRouterProvider.when('/signup', '/join#signup');
  $urlRouterProvider.when('/login', '/join#login');

  let states = [
    {
      name: 'home',
      url: '/home',
      template: require('../view/home/home.html'),
      controller: 'HomeController',
      controllerAs: 'homeCtrl',
      resolve: {
        profileService: 'profileService',
        wayService: 'wayService',
        reviewService: 'reviewService',
        profile: function(profileService) {
          return profileService.fetchProfile()
          .then( profile => profile);
        },
        ways: function(wayService) {
          return wayService.fetchWays()
          .then( ways => ways);
        },
        isAuthorized
      }
    },
    {
      name: 'landing',
      url: '/join',
      template: require('../view/landing/landing.html'),
      controller: 'LandingController',
      controllerAs: 'landingCtrl',
      resolve: {
        isAuthorized
      },
      onEnter: function landingOnEnter(isAuthorized, $location) {
        if (isAuthorized) $location.url('/home');
      }
    },
    {
      name: 'message',
      url: '/message',
      template: require('../view/message/message.html'),
      controller: 'MessageController',
      controllerAs: 'messageCtrl',
      resolve: {
        isAuthorized
      }
    },
    {
      name: 'way',
      url: '/way',
      template: require('../view/way/way.html'),
      controller: 'WayController',
      controllerAs: 'wayCtrl',
      resolve: {
        wayService: 'wayService',
        profileService: 'profileService',
        ways: function(wayService) {
          if (wayService.waysFetchFlag) return;

          return wayService.fetchWays()
          .then( ways => ways);
        },
        myProfile,
        isAuthorized
      }
    }
  ];

  const stateConfig = {
    onEnter
  };
  states.forEach( state => {
    if (state.name === 'landing') $stateProvider.state(state);
    else $stateProvider.state(Object.assign(state, stateConfig));
  });
}

function isAuthorized($window) {
  if($window.localStorage.token) return true;
  return false;
}

function onEnter(isAuthorized, $location) {
  if (!isAuthorized) $location.url('/');
}

function myProfile(profileService) {
  return profileService.fetchProfile()
  .then( profile => profile)
  .catch(console.log);
}
