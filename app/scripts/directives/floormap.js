'use strict';
/**
 * @ngdoc directive
 * @name projectSsApp.directive:floorMap
 * @description
 * # floorMap
 */
angular.module('projectSsApp')
.directive('floorMap', ['floorFactory', function (floorFactory) {
	var margin = floorFactory.margin;
	var width = floorFactory.width;
	var height = floorFactory.height;
	var movex = floorFactory.movex;
	var movey = floorFactory.movey;
	var dragStep = floorFactory.dragStep;
	var drag = floorFactory.drag;
	
	return {
	restrict: 'E',
	link: function (scope, element, attr) {
		var initialized = false,
			selectedDesk = {},
			desks,
			deskRects,
			deskRectsID,
			deskHandles;

		var dragstarted = function (d) {
			d3.event.sourceEvent.stopPropagation();
			// this.parentNode.appendChild(this); //this changes rendering order by re-appending the elemnt to the end
			d3.select(this).select('rect')
				.classed('drag', true)
				// .transition()
				// .ease("elastic")
				// .duration(500)
			floorFactory.hideEditBox();
			scope.$apply();
		};
		var dragged = function (d) {
			// d.x += d3.event.dx || 0;
			// d.y += d3.event.dy || 0;
			// movex = Math.round(d.x / dragStep) * dragStep;
			// movey = Math.round(d.y / dragStep) * dragStep;
			// d3.select(this).attr("transform", "translate(" + movex + "," + movey + ")");
			// console.log('dragging 2', d.x, d.y, d3.event.dx, d3.event.dy);
			d.x = d3.event.x;
			d.y = d3.event.y;
			d3.select(this).attr("transform", "translate(" + d.x+ "," +  d.y + ")");
		};
		var dragended = function (d) {
			d3.select(this).select('rect').classed('drag', false)
			// d.x = movex || d.x;
			// d.y = movey || d.y;
			
			if (floorFactory.isEditBoxOpened) {
				floorFactory.showEditBox(d.x, d.y);
			} else {
				// floorFactory.updateCursorPos(d.x, d.y);
			}
			scope.$apply(); //apply on drag end instead of on drag
			
		};

		// base svg
		var svg = floorFactory.initializeBase(element);
		svg.on('click', function () {
			if (d3.event.defaultPrevented) return;
			console.log('click on svg');
			floorFactory.hideEditBox();
			scope.$apply();
		});
		// gridlines
		var grid = floorFactory.initializeGridLines();

		var desksContainer = floorFactory.initializeDataContainer('g', 'desks-container');

		var bindFloorData = function(value){
			console.log('init');
			initialized = true;
			desks = desksContainer.selectAll('g')
				.data(value).enter()
					.append('g')
					.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
					
			deskRects = desks.append('rect')
				.attr('class', 'points')
				.attr('width', 40)
				.attr('height', 60)
				.attr('fill', function () {
					return '#'+Math.floor(Math.random()*16777215).toString(16);
				})
				.on('mouseover', function(d){
					var nodeSelection = d3.select(this).style({opacity:'0.8'});
				})
				.on('mouseleave', function (d) {
					var nodeSelection = d3.select(this).style({opacity:'1'});
				})
				.on('click', function (d) {
					if (d3.event.defaultPrevented) return;
					d3.event.stopPropagation(); //prevent bubbling up
					selectedDesk = d;
					if (scope.editMode) {
						floorFactory.showEditBox(d.x, d.y);
					}
					floorFactory.appendRotateBox(d.x, d.y);
					scope.$apply();
				})
	
				.on('blur', function (d) {
					if (d3.event.defaultPrevented) return;
					d3.select(this).attr('fill', function (d) {
						return '#'+Math.floor(Math.random()*16777215).toString(16);
					});
					floorFactory.removeRotateBox();
				});

			deskRectsID = desks.append('text')
				.text(function (d) {
					return d.deskID;
				});
		};

		scope.$watch(attr.desksData, function(newValue, oldValue){
			if (!initialized) {
				bindFloorData(newValue);
			}
			if (newValue.length !== oldValue.length) {
				bindFloorData(newValue);
			}
		}, true);

		scope.$on('editDeskPosition', function (event, args) {
			if (args) {
				drag.origin(function (d) {
					return d;
				}).on('dragstart', dragstarted)
					.on('drag', dragged)
					.on('dragend', dragended);
				desks.call(drag)
			} else {
				drag.origin(function (d) {
					return d;
				}).on('dragstart', null)
					.on('drag', null)
					.on('dragend', null);
				desks.call(drag)
			}
		});

		scope.$on('addDesk', function (event, args) {
			if(args.addMode) {
				//
			}
		});
	}
	};
}]);
