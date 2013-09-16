
function Fish(posx, posy, posz, imageSRC, imageWidth, imageHeight, highContrast) {

	var TO_RADIANS = Math.PI/180; 
	
	this.domElement = document.createElement('div');

     
    if(highContrast){//this.domElement.innerHTML = '<img src='+imageSRC+' />';
//  var img2 = document.createElement("IMG");
  //  img2.src = imageSRC;
    
   // this.domElement.appendChild(img2);
   // img2.className = "image"; 
   //  img2.onmousemove = null;
   // img2.onmouseup = null;
    //img2.style.position='absolute';
   // img2.style.zIndex='-1';
   // img2.style.pointerEvents='none';
   // 
   //
   // img2.style.msPointerEnabled='none';
this.domElement.innerHTML = '<img src='+imageSRC+' />';
this.domElement.childNodes[0].style.pointerEvents = "none";
this.domElement.childNodes[0].style.pointerEnabled = "none";
    // this.domElement.style.background = 'url('+imageSRC+') transparent';
    //  this.domElement.style.zIndex='2';
}
    else this.domElement.style.background = 'url('+imageSRC+') transparent';

	this.domElement.style.position = 'absolute';
	this.domElement.style.display = 'block'; 
	this.domElement.style.width = imageWidth+"px"; 
	this.domElement.style.height = imageHeight+"px";
	this.domElement.style.webkitTransformOrigin = (imageWidth/2)+"px "+(imageHeight/2)+"px"; 
	this.domElement.style.MozTransformOrigin = (imageWidth/2)+"px "+(imageHeight/2)+"px"; 
	this.domElement.style.transformOrigin = (imageWidth/2)+"px "+(imageHeight/2)+"px"; 
	this.domElement.style.OTransformOrigin = (imageWidth/2)+"px "+(imageHeight/2)+"px"; 
	this.domElement.style.pointerEvents="auto";
	
	// the position of the fish
	this.posX = posx; 
	this.posY = posy; 
	this.posZ = posz; 
	
	// the velocity 
	this.velX = 0; 
	this.velY = 0; 
	this.velZ = 0; 
	
	this.size = 1; 
	this.enabled = true; 
	// add this to the yVel every frame to simulate gravity
	this.gravity = 0; 
	var counter = 0; 

	this.update = function() {

		// add gravity force to the y velocity 
		this.velY += this.gravity; 
	
		// and the velocity to the position
		this.posX += this.velX;
		this.posY += this.velY; 
		this.posZ += this.velZ; 
	
		//rotate pos and vel around the centre
		counter++; 
		this.rotate(2); 

	};
	
	this.render = function() {
		var dom = this.domElement,
			styleStr,
			sx = Math.sin(counter*0.4)*0.04 + this.size, 
			sy = Math.sin(Math.PI + counter*0.4)*0.04 + this.size; 
	
		dom.style.webkitTransform = "translate3d("+this.posX+"px, "+this.posY+"px, "+this.posZ+"px) scale("+sx+","+sy+") rotate("+Math.sin(counter*0.05)*20+"deg)"; 
		dom.style.MozTransform = "translate3d("+this.posX+"px, "+this.posY+"px, "+this.posZ+"px) scale("+sx+","+sy+") rotate("+Math.sin(counter*0.05)*20+"deg)"; 
		dom.style.transform = "translate3d("+this.posX+"px, "+this.posY+"px, "+this.posZ+"px) scale("+sx+","+sy+") rotate("+Math.sin(counter*0.05)*20+"deg)"; 
		dom.style.OTransform = "translate3d("+this.posX+"px, "+this.posY+"px, "+this.posZ+"px) scale("+sx+","+sy+") rotate("+Math.sin(counter*0.05)*20+"deg)"; 

	};
	
	this.rotate = function(angle, useRadians) {
		
		// trig that rotates around the y axis (affecting x and z)
		var cosRY = Math.cos(angle * (useRadians ? 1 : TO_RADIANS));
		var sinRY = Math.sin(angle * (useRadians ? 1 : TO_RADIANS));

		var tempx = this.posX- HALF_WIDTH; 
		this.posX= (tempx*cosRY)-(this.posZ*sinRY) +HALF_WIDTH;
		this.posZ= (tempx*sinRY)+(this.posZ*cosRY);

		tempx = this.velX; 
		this.velX= (tempx*cosRY)-(this.velZ*sinRY);
		this.velZ= (tempx*sinRY)+(this.velZ*cosRY);

	};

	
}