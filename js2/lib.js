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