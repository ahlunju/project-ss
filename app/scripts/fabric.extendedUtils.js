// customise fabric.Object with a method to resize rather than just scale after tranformation
fabric.Object.prototype.resizeToScale = function () {
	// resizes an object that has been scaled (e.g. by manipulating the handles), setting scale to 1 and recalculating bounding box where necessary
	switch (this.type) {
		case "circle":
			if (this.scaleX > this.scaleY) {
				this.radius *= this.scaleX;
			} else if (this.scaleY > this.scaleX) {
				this.radius *= this.scaleY;
			} else if (this.scaleX === this.scaleY) {
				this.radius *= this.scaleX;
			}
			this.scaleX = 1;
			this.scaleY = 1;
			this.width = this.radius*2;
			this.height = this.radius*2;
			break;
		case "ellipse":
			this.rx *= this.scaleX;
			this.ry *= this.scaleY;
			this.width = this.rx * 2;
			this.height = this.ry * 2;
			this.scaleX = 1;
			this.scaleY = 1;
			break;
		case "polygon":
		case "polyline":
			var points = this.get('points');
			for (var i = 0; i < points.length; i++) {
				var p = points[i];
				p.x *= this.scaleX
				p.y *= this.scaleY;
			}
			this.scaleX = 1;
			this.scaleY = 1;
			this.width = this.getBoundingBox().width;
			this.height = this.getBoundingBox().height;
			break;
		case "triangle":
		case "line":
		case "rect":
			this.width *= this.scaleX;
			this.height *= this.scaleY;
			this.scaleX = 1;
			this.scaleY = 1;
		default:
			break;
	}
}

// helper function to return the boundaries of a polygon/polyline
// something similar may be built in but it seemed easier to write my own than dig through the fabric.js code.  This may make me a bad person.
fabric.Object.prototype.getBoundingBox = function () {
	var minX = null;
	var minY = null;
	var maxX = null;
	var maxY = null;
	switch (this.type) {
		case "polygon":
		case "polyline":
			var points = this.get('points');

			for (var i = 0; i < points.length; i++) {
				if (typeof (minX) == undefined) {
					minX = points[i].x;
				} else if (points[i].x < minX) {
					minX = points[i].x;
				}
				if (typeof (minY) == undefined) {
					minY = points[i].y;
				} else if (points[i].y < minY) {
					minY = points[i].y;
				}
				if (typeof (maxX) == undefined) {
					maxX = points[i].x;
				} else if (points[i].x > maxX) {
					maxX = points[i].x;
				}
				if (typeof (maxY) == undefined) {
					maxY = points[i].y;
				} else if (points[i].y > maxY) {
					maxY = points[i].y;
				}
			}
			break;
		default:
			minX = this.left;
			minY = this.top;
			maxX = this.left + this.width;
			maxY = this.top + this.height;
	}
	return {
		topLeft: new fabric.Point(minX, minY),
		bottomRight: new fabric.Point(maxX, maxY),
		width: maxX - minX,
		height: maxY - minY
	}
};

fabric.Object.prototype.snapSize = function (gridSize) {
	var gridSize = gridSize || 10;
	var roundedWidth = Math.round(this.width /gridSize) * gridSize;
	var roundedHeight = Math.round(this.height / gridSize) * gridSize;
	this.set({
		width: roundedWidth,
		height: roundedHeight
	});
};