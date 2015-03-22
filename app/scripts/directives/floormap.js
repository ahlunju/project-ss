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
	var width = 500;
	var height = 500;
	return {
	restrict: 'E',
	link: function (scope, element, attr) {
			// console.log(attr);

		function clone(obj){
			if(obj == null || typeof(obj) != 'object')
				return obj;

			var temp = obj.constructor(); // changed

			for(var key in obj) {
				temp[key] = clone(obj[key]);
				return temp;
			}
		}
		// set up initial svg object
		var vis = d3.selectAll(element)
					.append("svg")
					.attr("viewBox", "-10 -10 500 510")
					.attr("width", width)
					.attr("height", height+20);

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
					var sel = d3.select(this),
						cx = sel.attr('cx'),
						cy = sel.attr('cy');

					var cursorData = d3.select(this).data();
					console.log(this,cursorData);

					g.selectAll('add drag memory')
						.data(clone(cursorData)).enter()
						.append('circle')
						.classed('drag', true)
						.attr('cx', cx)
						.attr('cy', cy)
						.attr('r', 3)
						.attr('stroke', "black")
						.attr('fill', "red");
				})
				.on('drag', function(d, i) {
					var sel = d3.select('.drag'),
						cy = sel.attr('cy'),
						cx = sel.attr('cx');

					sel.attr('cy', parseInt(cy)+d3.event.dy);
					sel.attr('cx', parseInt(cx)+d3.event.dx);
					d.v = height-Math.round(cy);
					d.x = width-Math.round(cx);
					scope.$apply();
					console.log(d,i,cy, cx);
				})
				.on('dragend', function(d, i) {
					var drag = d3.selectAll('.drag');
					drag.remove();
				});

			g.selectAll('.points').call(dragfn);
		};

		scope.$watch(attr.ghBind, function(value){
				console.log(value);
				var changeFn = function(){
					vis.selectAll(".points")
						.data(value)
						.attr("cy", function(d){
							return height-d.v;
						})
						.attr('cx', function(d) {
							return width-d.x;
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
