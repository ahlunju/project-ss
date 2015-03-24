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
    'ui.select'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/floorplan.html',
        controller: 'FloorplanCtrl'
      })
      .when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/floor-plan', {
        templateUrl: 'views/floorplan.html',
        controller: 'FloorplanCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
