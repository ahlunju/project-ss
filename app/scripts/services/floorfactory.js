'use strict';

/**
 * @ngdoc service
 * @name projectSsApp.floorFactory
 * @description
 * # floorFactory
 * Service in the projectSsApp.
 */
angular.module('projectSsApp').service('floorFactory', ['employeesService', function (employeesService) {
	var self = this;

	// Returns radians
	var angleBetweenPoints = function (p1, p2) {
		if (p1[0] == p2[0] && p1[1] == p2[1]) {
			return Math.PI / 2;
		}
		else {
			return Math.atan2(p2[1] - p1[1], p2[0] - p1[0] );
		}
	};

	var toDegrees = function (rad) {
		return Math.floor(rad * (180/Math.PI));
	};

	var rotateAndTranslate = function (angle, x, y) {
		return "rotate(" + toDegrees(angle) + ") " + "translate(" + (x) + "," +  (y) + ")";
	};

	this.pointer = {
		x : 0,
		y : 0
	};

	this.margin = {
		top: -5,
		right: -5,
		bottom: -5,
		left: -5
	};

	this.gridSpacing = 10;
	this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - this.margin.left - this.margin.right;
	this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - this.margin.top - this.margin.bottom;

	this.movex;
	this.movey;

	this.dragStep = 10;
	this.drag = d3.behavior.drag();
	
	this.employees = employeesService.query();
	this.data = []; //array of objects that will be bound
	this.bindData = function (data) {
		//
	};

	this.initializeBase = function (el) {
		this.svg = d3.selectAll(el)
			.append('svg')
			.attr('width', this.width + this.margin.left + this.margin.right)
			.attr('height', this.height + this.margin.top + this.margin.bottom);

		this.svg.append('g')
			.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.right + ')');

		// this.svg.call(zoom);
		return this.svg;
	};

	this.initializeGridLines = function () {
		// gridlines
		this.grid = this.svg.append('g').attr('class', 'grid');
		this.grid.append('g')
			.attr('class', 'x axis')
			.selectAll('line')
			.data(d3.range(0, this.width, this.gridSpacing))
			.enter().append('line')
			.attr('x1', function(d) { return d; })
			.attr('y1', 0)
			.attr('x2', function(d) { return d; })
			.attr('y2', this.height);
		this.grid.append('g')
			.attr('class', 'y axis')
			.selectAll('line')
			.data(d3.range(0, this.height, this.gridSpacing))
			.enter().append('line')
			.attr('x1', 0)
			.attr('y1', function(d) { return d; })
			.attr('x2', this.width)
			.attr('y2', function(d) { return d; });

		return this.grid;
	};

	this.initializeDataContainer = function (el, className) {
		this.dataContainer = this.svg.append(el)
				.attr('class', className);
		return this.dataContainer;
	};

	// rotateBox, use to rotate the shape
	this.rotateBox;
	this.appendRotateBox = function addRotateBox(x,y) {
		var startx = x;
		var starty = y;
		var boxWidth = 40;
		var boxHeigth = 60;
		var lineData = [
			{x: 0,y: 0},
			{x: 0 + boxWidth, y: 0},
			{x: 0 + boxWidth, y: 0 + boxHeigth},
			{x: 0, y: 0 + boxHeigth},
			{x: 0, y: 0}
		];

		var line = d3.svg.line()
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; })
			.interpolate("linear");
		var lineStartX = 20;
		var lineStartY = 0;
		var lineEndX = lineStartX;
		var lineEndY = lineStartY - 40;

		this.rotateBox = this.svg.append('g').attr('class', 'rotate-box-group').attr('transform', rotateAndTranslate(0,startx, starty));

		// this.rotateBox.append('path').attr('class', 'dashed rotate-box').attr('d', line(lineData));
		this.rotateBox.append('rect')
						.attr('width', boxWidth)
						.attr('height', boxHeigth)
						.attr('class', 'dashed rotate-box')
						.attr('transform', 'translate(' + (-boxWidth/2) + ',' + (-boxHeigth/2) + ')');

		this.rotateBox.append('path')
					.attr('class', 'solid rotate-stem')
					.attr('d', 'M '+ (lineStartX -boxWidth/2) + ' ' + (lineStartY - boxHeigth/2) + ' L '+ (lineEndX -boxWidth/2 )+ ' ' + (lineEndY - boxHeigth/2));
		var angle = 0;

		var rotateHandle = this.rotateBox.append('circle')
			.attr('class', 'rotate-handle')
			.attr('r', 4)
			.attr('cx', lineEndX)
			.attr('cy', lineEndY) // 60 + 40 + 4 = 104
			.attr('transform', 'translate(' + (-boxWidth/2) + ',' + (-boxHeigth/2) + ')');

		rotateHandle.call(d3.behavior.drag()
			.on("drag", function (d) {
				d3.event.sourceEvent.stopPropagation();
				var parent = d3.select(this.parentNode);
				var originX = d3.transform(parent.attr('transform')).translate[0];
				var originY = d3.transform(parent.attr('transform')).translate[1];

				var exy = [d3.event.x, d3.event.y];
				var dxy = [0, 0];
				// console.log(exy);
				// console.log(dxy);
				angle = angle + angleBetweenPoints(exy, dxy);
				self.rotate(angle, originX, originY);
			})
		);
		// for debugging
		// rotateHandle.on('click', function() {
		// 		console.log('rotate');
		// 		angle+=10;
		// 		self.rotate(angle, startx, starty);
		// 	})
	};

	this.updateRotateBoxPos = function (x, y) {
		if (this.rotateBox) {
			this.rotateBox.attr('transform', "rotate(0) translate(" + x+ "," +  y + ")");
		}
	};

	this.removeRotateBox = function () {
		console.log('remove rotate box');

		if (this.rotateBox) {
			this.rotateBox.remove();
		}
	};
	
	this.rotate = function (angle, x, y) {
		// console.log(toDegrees(angle));
		this.rotateBox.attr('transform', 'rotate(' + toDegrees(angle) + ' ' + x + ' ' + y + ')' + ' translate(' + (x) + ',' + (y) + ')');
	};
	// EditBox
	this.isEditBoxOpened = false;
	this.editBoxPosition = {
		top	: '0px',
		left : '0px',
		display : 'none'
	};

	this.updateCursorPos = function (x, y) {
		this.editBoxPosition.top =  y +'px';
		this.editBoxPosition.left = x + 50 + 'px';
		this.editBoxPosition.display = 'none';
		console.log(this.editBoxPosition);
		this.isEditBoxOpened = true;
	};

	this.showEditBox = function (x, y) {
		this.isEditBoxOpened = true;
		this.editBoxPosition.top =  y +'px';
		this.editBoxPosition.left = x + 50 + 'px';
		this.editBoxPosition.display = 'block';
		// console.log(this.editBoxPosition);
	};

	this.hideEditBox = function () {
		this.editBoxPosition.display = 'none';
		console.log('hideEditBox');
	};

	this.addNewDesk = function () {
		//
	};

	this.appendTempObject = function () {
		var tempGroup = this.dataContainer.append('g').attr('class', 'temp-object')
			.attr("transform", function (d) {
				console.log(self.pointer);
				return "translate(" + self.pointer.x + "," + self.pointer.y + ")";
			})
		tempGroup.append('rect').attr('width', 40).attr('height', 60).attr('fill', '#bada55');
	};

	this.updateTempObjectPos = function (x, y) {
		this.dataContainer.select('.temp-object').attr('transform', "translate(" + x+ "," +  y + ")");
	};

	this.removeTempObject = function () {
		this.dataContainer.select('.temp-object').remove();
	};
}]);
