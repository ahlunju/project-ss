'use strict';
/**
 * @ngdoc directive
 * @name projectSsApp.directive:floorMap
 * @description
 * # floorMap
 */
angular.module('projectSsApp')
  .directive('floorMap', function () {

	var margin = {top: -5, right: -5, bottom: -5, left: -5},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	return {
	restrict: 'E',
	link: function (scope, element, attr) {
		
		var dragstarted = function () {
			console.log(this);
			d3.select(this).classed('drag', true);
		};
		var dragged = function (d) {
			d3.select(this)
				.attr('cx', d.x = Math.round(d3.event.x))
				.attr('cy', d.y = Math.round(d3.event.y));
		};
		var dragended = function () {
			d3.select(this).classed('drag', false);
			scope.$apply(); //apply on drag end instead of on drag
		};

		var drag = d3.behavior.drag();

		// set up initial svg object
		var svg = d3.selectAll(element)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
			// .call(zoom);

		var grid = svg.append('g').attr('class', 'grid');
		grid.append('g')
			.attr('class', 'x axis')
			.selectAll('line')
			.data(d3.range(0, width, 10))
			.enter().append('line')
			.attr('x1', function(d) { return d; })
			.attr('y1', 0)
			.attr('x2', function(d) { return d; })
			.attr('y2', height);
		grid.append('g')
			.attr('class', 'y axis')
			.selectAll('line')
			.data(d3.range(0, height, 10))
			.enter().append('line')
			.attr('x1', 0)
			.attr('y1', function(d) { return d; })
			.attr('x2', width)
			.attr('y2', function(d) { return d; });

		var desksContainer = svg.append('g').attr('class', 'desks-container');
		var desks;
		var init = function(value){

			desks = desksContainer.selectAll('circle')
				.data(value).enter()
				.append('circle')
				.attr('class', 'points')
				.attr('r', 10)
				.attr('cx', function(d){
					return d.x;
				})
				.attr('cy', function(d){
					return d.y;
				})
				// .call(drag);
		};

		scope.$watch(attr.ghBind, function(value){
			scope.data = value;
			init(value);
		}, true);

		scope.$on('editDeskPosition', function (event, args) {
			console.log(args);
			if (args) {
				drag.on('dragstart', dragstarted)
					.on('drag', dragged)
					.on('dragend', dragended);
				desks.call(drag);
			} else {
				drag.on('dragstart', null)
					.on('drag', null)
					.on('dragend', null);
				desks.call(drag);
			}
		});
	}
}});
