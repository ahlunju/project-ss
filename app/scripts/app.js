'use strict';

/**
 * @ngdoc overview
 * @name projectSsApp
 * @description
 * # projectSsApp
 *
 * Main module of the application.
 */
angular
  .module('projectSsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',//not using at the moment
    'ui.select',
    'ui.bootstrap',
    'colorpicker.module'
  ])
  .config(function ($routeProvider, $stateProvider) {
    $routeProvider.otherwise("/");
    
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'views/floorplanner.html',
      controller: 'FloorplannerCtrl'
    });
    $stateProvider.state('floor-planner', {
      url: '/floor-planner',
      templateUrl: 'views/floorplanner.html',
      controller: 'FloorplannerCtrl'
    });
  });
