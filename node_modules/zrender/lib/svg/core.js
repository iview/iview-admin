
	
	var svgURI = "http://www.w3.org/2000/svg";
	
	module.exports = {
		createElement: function (name) {
			return document.createElementNS(svgURI, name);
		}
	};
