// Setup Canvas to be full width and height
var canvas = document.querySelector('canvas#graph'),
	degOut = document.querySelector('div#degrees'),
	radOut = document.querySelector('div#radians'),
	xOut = document.querySelector('div#x'),
	yOut = document.querySelector('div#y'),
	c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

resizeCanvas(canvas)

window.onload = paint
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
		pixelsPI: 800,
		tickLength: 10
	}
}
var points = []


var points2 = [], pointsTangent = []
for ( i = 0; i <= 360; i ++) {
	points2.push({ x: Math.cos(Math.radians(i) * -1), y: Math.sin(Math.radians(i) * -1) })
}

for ( i = 0; i <= 360; i ++) {
	var y = 0; 
	if (points2[i].y > 1) {
		y = 0
	} else {
		y = -points2[i].y / points2[i].x
	}
	pointsTangent.push({ x: points2[i].x, y: y})

}

// mobile testing
// console.log(data.circle.originRatioX * canvas.width)
// console.log(data.circle.alternateX > canvas.width * data.circle.originRatioX)

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
		data.graph.pixelsPI = 800
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
	// triangles
	if (Math.round(deg) % 45 == 0 && Math.round(deg) % 90 !== 0) {
		c.beginPath()
		c.moveTo(0,0)
		c.lineTo(xLim, 0)
		c.lineTo(xLim, yLim)
		c.lineTo(0,0)
	
		// fill & stroke
		c.fillStyle = "rgba(215, 46, 44, 0.6)"
		c.strokeStyle = "#000"
		c.fill()
		c.stroke()

	}

	if (Math.round(deg) % 30 == 0) {
		c.beginPath()
		c.moveTo(0,0)
		c.lineTo(xLim, 0)
		c.lineTo(xLim, yLim)
		c.lineTo(0,0)
	
		// fill & stroke
		c.fillStyle = "rgba(255, 165, 0, .5)"
		c.strokeStyle = "#000"
		c.fill()
		c.stroke()
	}
	// radius
	var radius = new Line(0, 0, xLim, yLim);
	radius.drawOneArrowhead(c);
	// angle thingy
	c.beginPath()
	c.arc(0, 0, 60, 0, Math.radians(deg) * -1, true)
	c.stroke()

	var xFont = Math.cos(Math.radians(deg) * -1) * (data.circle.radius + 30)
	var yFont = Math.sin(Math.radians(deg) * -1) * (data.circle.radius + 30)

	c.font = 'bold 20px Arial, sans-serif';
	c.fillStyle = '#3197EE';
	c.textBaseline = 'middle';
	c.textAlign = "center"
	var h= '00B0'
	c.fillText(Math.floor(deg).toString() + String.fromCharCode(parseInt(h, 16)), xFont , yFont);
	c.strokeStyle = 'blue';
	// c.strokeText(Math.floor(deg).toString(), xFont, yFont);

	

	c.restore()
}

// (int, {waves})
function drawWaves (deg, waves) {
	c.save()
	// canvas (0,0) in center of graph
	goToGraph(c)
	var period = Math.floor((Math.radians(deg) / (Math.PI * 2)) * data.graph.pixelsPI)
	// draw origin
	
	
	switch (waves) {
		case "sin":
			sine(false)
			cosine(true)
			tangent(true)
			break
		case "cos":
			sine(true)
			cosine(false)
			tangent(true)
			break
		case "tan":
			sine(true)
			cosine(true)
			tangent(false)
			break
		case "all":
			sine()
			cosine()
			tangent()
		default:
			sine()
			cosine()
			tangent()
	}

	function sine (dull /*bool*/) {
		// sine
		c.beginPath()
		c.moveTo(0, 0)
		var degrees = deg
		for(p = 0; p < deg; p += 2) {
			c.lineTo(p / 360 * data.graph.pixelsPI, points2[p].y * data.graph.height/2)
		}
		if (dull) {
			c.strokeStyle = "rgba(256, 0, 0, 0.1)"
		} else {
			c.strokeStyle = "red"
		}
		c.lineWidth = 2;
		c.stroke()
		c.beginPath()
		c.fillStyle = "#000", c.strokeStyle = "#000"
		c.arc(period, points2[Math.floor(deg)].y * data.graph.height/2, data.circle.originRadius, 0, Math.radians(360))
		c.fill()
		c.stroke()
	}
	
	function cosine (dull /*bool*/) {
		// cosine
		c.beginPath()
		c.moveTo(0, 0)
		for(p = 0; p < deg; p += 2) {
			c.lineTo(p / 360 * data.graph.pixelsPI, points2[p].x * -data.graph.height/2)
		}
		if (dull) {
			c.strokeStyle = "rgba(0, 0, 256, 0.1)"
		} else {
			c.strokeStyle = "blue"
		}
		c.lineWidth = 2;
		c.stroke()
		c.beginPath()
		c.fillStyle = "#000", c.strokeStyle = "#000"
		c.arc(period, points2[Math.floor(deg)].x * -data.graph.height/2, data.circle.originRadius, 0, Math.radians(360))
		c.fill()
		c.stroke()
	}

	function tangent (dull /*bool*/) {
		// tangent
		c.stroke()
		c.beginPath()
		c.fillStyle = "#000", c.strokeStyle = "#000"
		c.arc(period, pointsTangent[Math.floor(deg)].y * -data.graph.height/4, data.circle.originRadius, 0, Math.radians(360))
		c.fill()
		c.stroke()
		c.beginPath()
		c.moveTo(0, 0)
		for(p = 0; p <= deg; p += 2) {
			y = 0
			lim = 4
			if(pointsTangent[p].y > lim) {
				y = lim
			} else {
				if(pointsTangent[p].y < -lim) {
					y = -lim
				} else {
					y = pointsTangent[p].y
				}
			}
			if(-lim < pointsTangent[p].y && pointsTangent[p].y < lim) {
				c.lineTo(p / 360 * data.graph.pixelsPI, y * -data.graph.height/4)
			} else {
	
				c.moveTo(data.graph.pixelsPI/4*(p/90), data.graph.height)
			}
		}
		if (dull) {
			c.strokeStyle = "rgba(0, 256, 0, 0.1)"
		} else {
			c.strokeStyle = "green"
		}
		c.lineWidth = 2;
		c.stroke()
	}
	
	// vertical line 
	c.beginPath()
	c.moveTo(period, data.graph.height)
	for(i = 0; i < 10; i += 1) {
		c.moveTo(period, data.graph.height + 10)
		c.lineTo(period, -data.graph.height - 10)
	}
	c.strokeStyle = "black"
	c.setLineDash([5,5])
	c.stroke()

	c.restore()
}

// update info
function writeInfo(degrees, mousePos) {
	var x = Math.cos(Math.radians(degrees) * -1)
	var y = Math.sin(Math.radians(degrees))
	degOut.innerHTML = Math.round(degrees) + "&deg"
	radOut.innerHTML = Math.roundTo(Math.radsNoPi(degrees), 2) + "&pi;"
	xOut.innerHTML = Math.roundTo(x, 2)
	yOut.innerHTML = Math.roundTo(y, 2)
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
		getRadios("radio")
		drawRadius(degrees)
		drawWaves(degrees, out)
		writeInfo(degrees, mousePos)
	}
}

// get mouse position
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	var x, y = canvas.height * data.circle.originRatioY
	if (data.circle.alternateX > canvas.width * data.circle.originRatioX) {
		x = data.circle.alternateX
	} else {
		x = canvas.width * data.circle.originRatioX
	}
	return {
		// correct for circle origin being shifted
		x: (evt.clientX - rect.left) - x,
		y: ((evt.clientY - rect.top) - canvas.height * data.circle.originRatioY) * -1
	};
}
// select function to graph
var out
function getRadios (name) {
	out = document.querySelector('input[name = "radio"]:checked').value;
}
document.querySelector(".settings").onclick = getRadios;
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



