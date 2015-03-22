'use strict';

/**
 * @ngdoc service
 * @name projectSsApp.floorplan
 * @description
 * # floorplan
 * Service in the projectSsApp.
 */
angular.module('projectSsApp')
  .service('floorPlanService', function (employeesService) {
  	var self = this;
  	this.EmployeesSvc = employeesService;
  	this.Employees = [];

    this.getEmployees = function () {
    	return employeesService.query(function (data) {
    		// console.log(data);
    		self.Employees = data;
    		return self.Employees;
    	});
    };

    this.updateEmployees = function () {
    	console.log(self.Employees);
    	// this.EmployeesSvc.update(self.Employees, function (success) {
    	// 	console.log(success);
    	// }, function (error) {
    	// 	console.log(error);
    	// });
    };

    this.addEmployee = function () {

    };

    this.deleteEmployee = function () {

    };
  });
