MathTools.RADIANS = Math.PI / 180;
MathTools.DEGREES = 180 / Math.PI;

function MathTools(){}

MathTools.randomRange = function(min, max) { return (Math.random()*(max-min))+min; };

MathTools.exponentialEaseOut = function ( v ) { return v === 1 ? 1 : - Math.pow( 2, - 10 * v ) + 1; };

MathTools.clamp = function (a,b,c) { return Math.max(b,Math.min(c,a)); };

MathTools.degToRad = function (v) { return v * MathTools.RADIANS; };
MathTools.radToDeg = function (v) { return v * MathTools.DEGREES; };

MathTools.unwrapDegrees = function (r) { r = r % 360; if (r > 180) r -= 360; if (r < -180) r += 360; return r; };

MathTools.Orbit = function ( horizontal, vertical, distance, o ) {
	if(!o) o = { x:0, y:0, z:0 };
	var p = this.degToRad( this.unwrapDegrees(vertical) );
	var t = this.degToRad( this.unwrapDegrees(horizontal) );
	var phi = { sin:Math.sin(p), cos:Math.cos(p) };
	var theta = { sin:Math.sin(t), cos:Math.cos(t) };
	return { x:(distance * phi.sin * theta.cos) + o.x, y:(distance * phi.cos) + o.y, z:(distance * phi.sin * theta.sin) + o.z };
};

MathTools.hitTest = function(x1, y1, w1, h1, x2, y2, w2, h2){
	if (x1 + w1 > x2) if (x1 < x2 + w2) if (y1 + h1 > y2) if (y1 < y2 + h2) return true;
	return false;
}

