Math.radians = function(degrees) {
	return (degrees * Math.PI) / 180
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
Math.realDegrees = function(mousePos) {
	var degrees = Math.degrees(Math.atan2(mousePos.y, mousePos.x))
	if (degrees < 0) degrees += 360
	return degrees
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

Line.prototype.drawOneArrowhead = function (c) {
	// arbitrary styling
	c.strokeStyle="#000";
	c.fillStyle="#000";
	c.lineWidth=1;
	
	// draw the line
	c.beginPath();
	c.moveTo(this.x1,this.y1);
	c.lineTo(this.x2,this.y2);
	c.stroke();
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


function Translate (c) {

}

Translate.prototype.move = function(first_argument) {
	// body...
};
