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
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'views/floorplanner.html',
      //   controller: 'FloorplannerCtrl'
      // })
      .when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/floor-plan', {
        templateUrl: 'views/floorplan.html',
        controller: 'FloorplanCtrl'
      })
      .when('/floor-planner', {
        templateUrl: 'views/floorplanner.html',
        controller: 'FloorplannerCtrl'
      })
      .otherwise({
        redirectTo: '/floor-planner'
      });
  });
