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
		width = 1500 - margin.left - margin.right,
		height = 800 - margin.top - margin.bottom;

	return {
	restrict: 'E',
	link: function (scope, element, attr) {
		var initialized = false;
		var dragstarted = function (d) {
			this.parentNode.appendChild(this); //this changes rendering order by re-appending the elemnt to the end
			d3.select(this)
				.classed('drag', true)
				.transition()
				.ease("elastic")
				.duration(500)
				.attr('width', 25)
				.attr('height', 45);
		};
		var dragged = function (d) {
			d3.select(this)
				.attr('x', d.x = Math.round(d3.event.x))
				.attr('y', d.y = Math.round(d3.event.y));
		};
		var dragended = function (d) {
			d3.select(this).classed('drag', false)
				.transition()
				.ease("elastic")
				.duration(500)
				.attr('width', 20)
				.attr('height', 40);
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
			console.log('init');
			initialized = true;
			desks = desksContainer.selectAll('rect')
				.data(value).enter()
					.append('rect')
					.attr('class', 'points')
					.attr('width', 20)
					.attr('height', 40)
					.attr('fill', function () {
						return '#'+Math.floor(Math.random()*16777215).toString(16);
					})
					.attr('x', function (d) {
						return d.x;
					})
					.attr('y', function (d) {
						return d.y;
					})
		};

		scope.$watch(attr.ghBind, function(value){
			if (!initialized) {
				init(value);
			}
		}, true);

		scope.$on('editDeskPosition', function (event, args) {
			if (args) {
				drag.origin(function (d) {
					return d;
				}).on('dragstart', dragstarted)
					.on('drag', dragged)
					.on('dragend', dragended);
				desks.call(drag);
			} else {
				drag.origin(function (d) {
					return d;
				}).on('dragstart', null)
					.on('drag', null)
					.on('dragend', null);
				desks.call(drag);
			}
		});
	}
}});
