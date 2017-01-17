// Setup Canvas to be full width and height
var canvas = document.querySelector('canvas#graph'),
	c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
// resize canvas on window resize
function resizeCanvas() {
	canvas.width = window.innerWidth
	setTimeout(function() {
		canvas.height = window.innerHeight
	}, 0);
};
// window.onresize = resizeCanvas
// resizeCanvas()
// move origin to middle vertically
// c.translate(canvas.width/2, canvas.height/2);

// Data Set
var data = {
	circle: {
		radius: 200,
		originRadius: 3,
		originRatioX: 0.2,
		alternateX: 250,
		originRatioY: 0.5
	},
	graph: {
		originRatioX: 0.45,
		height: 400,
		padding: 40,
		pixelsPI: 600,
		tickLength: 10
	}
}
var points = []


var points2 = [], pointsTangent = []
for ( i = 0; i <= 360; i ++) {
	points2.push({ x: Math.cos(Math.radians(i) * -1), y: Math.sin(Math.radians(i) * -1) })
}
console.log(data.circle.originRatioX * canvas.width)
console.log(data.circle.alternateX > canvas.width * data.circle.originRatioX)

function goToCircle (c) {
	var x, y = canvas.height * data.circle.originRatioY
	if (data.circle.alternateX > canvas.width * data.circle.originRatioX) {
		x = data.circle.alternateX
	} else {
		x = canvas.width * data.circle.originRatioX
	}
	c.translate(x, y)
}
function goToGraph (c) {
	var x, y = canvas.height * data.circle.originRatioY
	if (data.circle.alternateX > canvas.width * data.circle.originRatioX) {
		x = data.circle.alternateX + data.circle.radius + data.graph.padding * 4
		data.graph.pixelsPI = 300
	} else {
		x = canvas.width * data.graph.originRatioX
		data.graph.pixelsPI = 600
	}
	c.translate(x, y)
}


function drawUnitCircle() {
	c.save()
	goToCircle(c)
	c.beginPath()
	// draw circle
	c.fillStyle = "none"
	c.strokeStyle = "#000"
	c.lineWidth = 2
	c.arc(0, 0, data.circle.radius, 0, Math.radians(360), false)
	c.fill()
	c.stroke()
	// draw origin
	c.beginPath()
	c.fillStyle = "#000"
	c.arc(0, 0, data.circle.originRadius, 0, Math.radians(360), false)
	c.fill()
	c.stroke()
	// arrowheads
	var xAxis = new Line(-data.circle.radius - 30, 0, data.circle.radius + 30, 0);
	var yAxis = new Line(0, -data.circle.radius - 30, 0, data.circle.radius + 30);
	xAxis.drawWithArrowheads(c);
	yAxis.drawWithArrowheads(c);

	c.restore()
}

function drawGraph() {
	c.save()
	// canvas (0,0) in center of graph
	goToGraph(c)
	// draw origin
	c.beginPath()
	c.fillStyle = "#000"
	c.arc(0, 0, data.circle.originRadius, 0, Math.radians(360), false)
	c.fill()
	c.stroke()
	// arrowheads
	var xAxis = new Line(-data.graph.padding * 2, 0, canvas.width - data.graph.padding * 2, 0);
	var yAxis = new Line(0, -data.graph.height / 2 - 15, 0, data.graph.height / 2 + 15);
	xAxis.drawWithArrowheads(c)
	yAxis.drawWithArrowheads(c)
	// ticks
	c.beginPath()
	c.moveTo(data.graph.pixelsPI, -data.graph.tickLength)
	c.lineTo(data.graph.pixelsPI, data.graph.tickLength)
	for(p = 0; p < 4; p++) {
		c.moveTo(p * data.graph.pixelsPI/4, -data.graph.tickLength/2)
		c.lineTo(p * data.graph.pixelsPI/4, data.graph.tickLength/2)
	}

	c.lineWidth = 1;
	c.stroke()

	c.restore()
}

function drawRadius (deg) {
	c.save()
	goToCircle(c)
	var xLim = data.circle.radius*Math.cos(Math.radians(deg) * -1)
	var yLim = data.circle.radius*Math.sin(Math.radians(deg) * -1)
	points.push({ x:Math.cos(Math.radians(deg) * -1), y:Math.sin(Math.radians(deg) * -1) })
	// radius
	var radius = new Line(0, 0, xLim, yLim);
	radius.drawOneArrowhead(c);
	// angle thingy
	c.beginPath()
	c.arc(0, 0, 60, 0, Math.radians(deg) * -1, true)
	c.stroke()
	c.restore()
}

function drawWaves (deg) {
	c.save()
	// canvas (0,0) in center of graph
	goToGraph(c)
	var period = Math.floor((Math.radians(deg) / (Math.PI * 2)) * data.graph.pixelsPI)
	// draw origin
	c.beginPath()
	c.fillStyle = "#000"
	c.arc(period, points2[Math.floor(deg)].y * data.graph.height/2, data.circle.originRadius, 0, Math.radians(360))
	c.fill()
	c.stroke()

	// draw origin
	c.beginPath()
	c.fillStyle = "#000"
	c.arc(period, points2[Math.floor(deg)].x * -data.graph.height/2, data.circle.originRadius, 0, Math.radians(360))
	c.fill()
	c.stroke()

	// graph sin
	c.beginPath()
	c.moveTo(0, 0)
	var degrees = deg
	for(p = 0; p < deg; p += 2) {
		c.lineTo(p / 360 * data.graph.pixelsPI, points2[p].y * data.graph.height/2)
	}
	
	c.strokeStyle = "red"
	c.stroke()

	// graph cosine
	c.beginPath()
	c.moveTo(0, 0)
	for(p = 0; p < deg; p += 2) {
		c.lineTo((p / 360) * data.graph.pixelsPI, points2[p].x * -data.graph.height/2)
	}
	c.strokeStyle = "blue"
	c.stroke()

	// graph tangent
	// c.beginPath()
	// c.moveTo(0, 0)
	// for(p = 0; p < deg; p += 5) {
	// 	c.lineTo((p / 360) * data.graph.pixelsPI, (points2[p].y / points2[p].x) * -data.graph.height/2)
	// }
	// c.strokeStyle = "green"
	// c.stroke()

	// vertical line 
	c.beginPath()
	c.moveTo(period, data.graph.height)
	for(i = 0; i < 10; i += 1) {
		c.moveTo(period, data.graph.height/2 + 10)
		c.lineTo(period, -data.graph.height/2 - 10)
	}
	c.strokeStyle = "black"
	c.setLineDash([5,5])
	c.stroke()

	c.restore()
}

// wipe the screen
function clear() {
	c.fillStyle = "#fff"
	c.fillRect(0, 0, canvas.width, canvas.height)
}
// static, called every frame
function paint() {
	clear()
	drawUnitCircle()
	drawGraph()
	
}


function run(mousePos) {
	paint()

	if (mousePos != undefined) {
		var degrees = Math.realDegrees(mousePos)

		drawRadius(degrees)
		drawWaves(degrees)
	}
}

// get mouse position
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		// correct for circle origin being shifted
		x: (evt.clientX - rect.left) - canvas.width * data.circle.originRatioX,
		y: ((evt.clientY - rect.top) - canvas.height * data.circle.originRatioY) * -1
	};
}
// only update when you click and drag
var downFlag = false;
canvas.onmousedown = function () {
	downFlag = true
	canvas.style.cursor = "move"
}
canvas.onmouseup = function () {
    downFlag = false
	canvas.style.cursor = "pointer"
}
canvas.addEventListener("mousemove", function(evt) {
	if (downFlag) {
		var mousePos = getMousePos(canvas, evt)
		run(mousePos)
	}
}, false);
run();



  //  for (i = 1; i < points.length - 2; i ++)
  //  {
  //     var xc = (points[i].x + points[i + 1].x) / 2;
  //     var yc = (points[i].y + points[i + 1].y) / 2;
  //     c.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  //  }
 	// // curve through the last two points
 	// c.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
 	// console.log({ x:Math.cos(Math.radians(deg) * -1) * 100, y:Math.sin(Math.radians(deg)) * 100 })