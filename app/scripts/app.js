'use strict';

/**
 * @ngdoc overview
 * @name projectSsApp
 * @description
 * # projectSsApp
 *
 * Main module of the application.
 */
var SSApp = angular
  .module('projectSsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.select',
    'ui.bootstrap',
    'colorpicker.module',
    'projectSsApp.common'
  ])
  .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/floor-planner");
    $stateProvider
    // .state('home', {
    //   url: '/home',
    //   templateUrl: 'views/floorplanner.html',
    //   controller: 'FloorplannerCtrl'
    // })
    .state('floor-planner', {
      url: '/floor-planner',
      templateUrl: 'views/floorplanner.html',
      controller: 'FloorplannerCtrl'
    })
  }]);
