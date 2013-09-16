function MathTools(){
	this.randomRange = function(min, max) { return (Math.random()*(max-min))+min; };

	this.exponentialEaseOut = function ( v ) { return v === 1 ? 1 : - Math.pow( 2, - 10 * v ) + 1; };

	this.clamp = function (a,b,c) { return Math.max(b,Math.min(c,a)); };

	this.degToRad = function (v) { return v * Math.PI / 180; };
	this.radToDeg = function (v) { return v * 180 / Math.PI; };

	this.unwrapDegrees = function (r) { r = r % 360; if (r > 180) r -= 360; if (r < -180) r += 360; return r; };

	this.Orbit = function ( horizontal, vertical, distance, o ) {
		if(!o) o = { x:0, y:0, z:0 };
		var p = this.degToRad( this.unwrapDegrees(vertical) );
		var t = this.degToRad( this.unwrapDegrees(horizontal) );
		var phi = { sin:Math.sin(p), cos:Math.cos(p) };
		var theta = { sin:Math.sin(t), cos:Math.cos(t) };
		return { x:(distance * phi.sin * theta.cos) + o.x, y:(distance * phi.cos) + o.y, z:(distance * phi.sin * theta.sin) + o.z };
	};

}