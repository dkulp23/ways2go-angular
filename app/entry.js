'use strict';

require('angular-material/angular-material.scss');
require('./scss/main.scss');
require('angular-jk-rating-stars/dist/jk-rating-stars.css');
const logo = require('./assets/ways2go.svg');
const background = require('./assets/background.jpg');

const
  path = require('path'),
  angular = require('angular'),
  camelcase = require('camelcase'),
  pascalcase = require('pascalcase'),
  uiRouter = require('angular-ui-router'),
  ngAnimate = require('angular-animate'),
  ngFileUpload = require('ng-file-upload'),
  ngMap = require('ngmap');
require('angular-aria');
require('angular-material');
require('angular-material-icons');
require('angular-jk-rating-stars');

const ways2go = angular.module('ways2go', [ngAnimate, uiRouter, ngFileUpload, 'ngMaterial', 'ngMdIcons', 'jkAngularRatingStars', ngMap]);

let context = require.context('./service/', true, /\.js$/);
context.keys().forEach( key => {
  let name = camelcase(path.basename(key, '.js'));
  let module = context(key);
  ways2go.service(name, module);
});

context = require.context('./config/', true, /\.js$/);
context.keys().forEach( key => {
  ways2go.config(context(key));
});



context = require.context('./view/', true, /\.js$/);
context.keys().forEach( key => {
  let name = pascalcase(path.basename(key, '.js'));
  let module = context(key);
  ways2go.controller(name, module);
});


context = require.context('./component/', true, /\.js$/);
context.keys().forEach( key => {
  let name = camelcase(path.basename(key, '.js'));
  let module = context(key);
  ways2go.component(name, module);
});

context = require.context('./filter/', true, /\.js$/);
context.keys().forEach( key => {
  let name = camelcase(path.basename(key, '.js'));
  let module = context(key);
  ways2go.filter(name, module);
});

context = require.context('./directive/', true, /\.js$/);
context.keys().forEach( key => {
  let name = camelcase(path.basename(key, '.js'));
  let module = context(key);
  ways2go.directive(name, module);
});
