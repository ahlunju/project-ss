'use strict';

/**
 * @ngdoc service
 * @name projectSsApp.floorFactory
 * @description
 * # floorFactory
 * Service in the projectSsApp.
 */
angular.module('projectSsApp').service('floorFactory', [ function () {
	var self = this;
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
	this.width = 1500 - this.margin.left - this.margin.right;
	this.height = 800 - this.margin.top - this.margin.bottom;

	this.movex;
	this.movey;

	this.dragStep = 10;
	this.drag = d3.behavior.drag();
	
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

	this.appendRotateBox = function addRotateBox(x,y) {
		var startx = x;
		var starty = y;
		var boxWidth = 40;
		var boxHeigth = 60;
		var lineData = [
			{x: startx,y: starty},
			{x: startx + boxWidth, y: starty},
			{x: startx + boxWidth, y: starty + boxHeigth},
			{x: startx, y: starty + boxHeigth},
			{x: startx, y: starty}
		];
		var line = d3.svg.line()
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; })
			.interpolate("linear");
		var lineStartX = startx + 20;
		var lineStartY = starty;
		var lineEndX = lineStartX;
		var lineEndY = lineStartY - 15;

		var rotateBoxGroup = this.svg.append('g').attr('class', 'rotate-box-group');
		rotateBoxGroup.append('path').attr('class', 'dashed rotate-box').attr('d', line(lineData));
		rotateBoxGroup.append('path').attr('class', 'solid rotate-stem').attr('d', 'M '+ lineStartX+ ' ' + lineStartY + ' L '+ lineEndX + ' ' + lineEndY);
		rotateBoxGroup.append('circle').attr('class', 'rotate-handle').attr('r', 4).attr('cx', lineEndX).attr('cy', lineEndY);
	};

	this.removeRotateBox = function removeRotateBox() {
		this.svg.select('.rotate-box-group').remove();
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
		console.log(this.editBoxPosition);
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
