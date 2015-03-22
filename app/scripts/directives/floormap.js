'use strict';

/**
 * @ngdoc directive
 * @name projectSsApp.directive:floorMap
 * @description
 * # floorMap
 */
angular.module('projectSsApp')
  .directive('floorMap', function () {

  // constants
	var width = 1000;
	var height = 1000;
	return {
	restrict: 'E',
	link: function (scope, element, attr) {
		// set up initial svg object
		var vis = d3.selectAll(element)
					.append("svg")
					.attr("viewBox", "-50 -50 1000 1000")
					.attr("width", width)
					.attr("height", height);

		var g = vis.selectAll('adding graphics element')
					.data([{x:0, y:0}])
					.enter()
					.append('g');

		var isInitialsed = false;

		var init = function(value){
			// console.log(value);

			g.selectAll('add circle elements')
				.data(value).enter()
				.append("circle")
				.attr("class", "points")
				.attr("r", 6)
				.attr("cx", function(d){
					return d.x;
				})
				.attr("cy", function(d){
					return d.v;
				});

			isInitialsed = true;

			// drag behavior
			var dragfn = d3.behavior
				.drag()
				.on('dragstart', function() {
					console.log(this);
					d3.select(this).classed("dragging", true);

				})
				.on('drag', function(d, i) {
					d3.select(this)
						.attr('cx', d.x = Math.round(d3.event.x))
						.attr('cy', d.v = Math.round(d3.event.y));
					scope.$apply();
				})
				.on('dragend', function(d, i) {
					d3.select(this).classed('drag', false);
				});

			g.selectAll('.points').call(dragfn);
		};

		scope.$watch(attr.ghBind, function(value){
				// console.log(value);
				var changeFn = function(){
					vis.selectAll(".points")
						.data(value)
						.attr("cy", function(d){
							return d.v;
						})
						.attr('cx', function(d) {
							return d.x;
						});
				}
				if(isInitialsed){
					changeFn();
				}else{
					init(value);
					changeFn();
				}
			
		}, true);
	}
}});
