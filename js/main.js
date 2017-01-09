Math.radians = function(degrees) {
	return Math.PI * degrees / 180
}
// Library
Math.degrees = function(radians) {
	return radians * 180 / Math.PI
}
Math.roundTo = function(number, precision) {
	var factor = Math.pow(10, precision);
	var tempNumber = number * factor;
	var roundedTempNumber = Math.round(tempNumber);
	return roundedTempNumber / factor;
}

function Line(x1,y1,x2,y2){
	this.x1=x1;
	this.y1=y1;
	this.x2=x2;
	this.y2=y2;
}
Line.prototype.drawWithArrowheads=function(c){
	// arbitrary styling
	c.strokeStyle="#000";
	c.fillStyle="#000";
	c.lineWidth=1;
	
	// draw the line
	c.beginPath();
	c.moveTo(this.x1,this.y1);
	c.lineTo(this.x2,this.y2);
	c.stroke();

	// draw the starting arrowhead
	var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
	startRadians+=((this.x2>=this.x1)?-90:90)*Math.PI/180;
	this.drawArrowhead(c,this.x1,this.y1,startRadians);
	// draw the ending arrowhead
	var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
	endRadians+=((this.x2>=this.x1)?90:-90)*Math.PI/180;
	this.drawArrowhead(c,this.x2,this.y2,endRadians);

}
Line.prototype.drawArrowhead=function(c,x,y,radians){
	c.save();
	c.beginPath();
	c.translate(x,y);
	c.rotate(radians);
	c.moveTo(0,0);
	c.lineTo(5,20);
	c.lineTo(-5,20);
	c.closePath();
	c.restore();
	c.fill();
}

// Setup Canvas
var canvas = document.querySelector('canvas#circle')
var c = canvas.getContext('2d')
c.translate(canvas.width/2, canvas.height/2);
c.lineCap="round"



// Data Set
var uC = {
	radius: 200,
	originR: 3,
	special_45_45_90: {
		x: Math.sqrt(2)/2,
		y: Math.sqrt(2)/2,
		h: 1,
		deg: 45
	},
	special_30_60_90: {
		x: Math.sqrt(3)/2,
		y: 1/2,
		h: 1
	}
}


// Draw Functions
function paint() {
	c.beginPath()
	// circle
	c.fillStyle = "none"
	c.lineWidth = 2
	c.arc(0, 0, uC.radius, 0, Math.radians(360), false)
	c.fill()
	c.stroke()
	// origin
	// c.fillStyle = "#000"
	c.beginPath()
	c.fillStyle = "#000"
	c.arc(0, 0, uC.originR, 0, Math.radians(360), false)
	c.fill()
	c.stroke()

	c.beginPath()
	c.moveTo(-uC.radius - 30, 0)
	c.lineTo(uC.radius + 30, 0)
	c.moveTo(0, -uC.radius - 30)
	c.lineTo(0, uC.radius + 30)
	c.stroke()

	
	var xAxis = new Line(-uC.radius - 30, 0, uC.radius + 30, 0);
	var yAxis = new Line(0, uC.radius + 30, 0, -uC.radius - 30);
	xAxis.drawWithArrowheads(c);
	yAxis.drawWithArrowheads(c);
}

function clear() {
	c.fillStyle = "#fff"
	c.fillRect(-250,-250, 500, 500)
}

function triangle(xLim, yLim, color) {
	c.moveTo(0,0)
	c.lineTo(xLim, 0)
	c.lineTo(xLim, yLim)
	c.lineTo(0,0)
	c.fillStyle = color
	c.fill()
	c.stroke()
}

function drawRadius(x, y, deg) {
	c.moveTo(0,0)
	var xLim = uC.radius*Math.cos(Math.radians(deg) * -1)
	var yLim = uC.radius*Math.sin(Math.radians(deg) * -1)

	// draw radius
	c.lineTo(xLim,yLim)
	c.stroke()
	
	// angle thingy
	c.beginPath()
	c.lineWidth = 3
	c.arc(0, 0, 100, 0, Math.radians(deg) * -1, true)
	c.stroke()

	c.beginPath()
	if (Math.round(degrees) % 90 == 0) {
		console.log("pi/2")

		
	}

	if (Math.round(degrees) % 45 == 0) {
		console.log("pi/4")
		triangle(xLim, yLim, "rgba(215, 46, 44, 0.6)")
	}

	if (Math.round(degrees) % 30 == 0) {
		console.log("pi/3")
		triangle(xLim, yLim, "rgba(255, 165, 0, .5)")
	}

	function isInRange(rotation, start, end){
    	return (rotation >= start && rotation <= end) || (rotation >= end && rotation <= start);
	}
	
}

function triangles(x, y, deg) {

}

function findDegrees (mousePos) {
	var degrees = Math.degrees(Math.atan2(mousePos.y, mousePos.x))
	if (degrees < 0) degrees += 360
	return degrees
}
function noPi (degrees) {
	var rads = Math.radians(degrees)/Math.PI
	return rads
}



var outDeg = document.querySelector("#degrees")
var outRad = document.querySelector("#radians")
var outX = document.querySelector("#x")
var outY = document.querySelector("#y")

// main
function update (mousePos) {
	degrees = findDegrees(mousePos)
	radNoPi = noPi(degrees);
	drawRadius(mousePos.x, mousePos.y * -1, degrees)
	
	// var f = new Fraction(0.33);
	// console.log(f);

	outDeg.innerHTML = Math.round(degrees) + "&deg"
	outRad.innerHTML = Math.roundTo(radNoPi, 2) + "pi"


	var xLim = uC.radius*Math.cos(Math.radians(degrees) * -1)
	var yLim = uC.radius*Math.sin(Math.radians(degrees) * -1)
	outX.innerHTML = Math.roundTo(xLim/uC.radius, 2)
	outY.innerHTML = Math.roundTo(yLim/uC.radius, 2)
}

function run(mousePos) {
	clear()
	paint()
	if (mousePos != undefined) {
		update(mousePos)
	}
}


function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: (evt.clientX - rect.left) - 250,
		y: ((evt.clientY - rect.top) - 250) *-1 
	};
}

canvas.addEventListener("mousemove", function(evt) {
	var mousePos = getMousePos(canvas, evt);
	// var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	// console.log(console)
	run(mousePos)
}, false);

// setInterval(run, 100)

run();