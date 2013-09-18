/*
AnimatedPNG - A Javascript library for animated PNG images 
Copyright (C) 2007-2008 Steve Jones (steve@squaregoldfish.co.uk)
Version 1.01
Web: http://www.squaregoldfish.co.uk/software/animatedpng
Email: animatedpng@squaregoldfish.co.uk

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details:
http://www.gnu.org/licenses/gpl.txt
*/

// Global variable for holding animated images
animatedPNGs = new Array();

// Constructor for an Animated PNG. This takes only the essential
// parameters for the animation; other options may be specified
// using other functions.
//    imageName - The name of this animation
//    firstImage - The filename of the first image
//    imageCount - The number of frames in the animation
//    delay - The default delay between frames
function AnimatedPNG(imageName, firstImage, imageCount, delay)
	{
	/** Instance Variables **/

	// The name of this animation object
	this.animName = imageName;

	// The array of images for this animation
	this.images = new Array();
	
	// The frame-specific delays
	this.delays = new Array();
	
	// The amount of padding required in image numbers
	this.padCount = 0;
	
	// The number of the first image in the sequence
	this.firstImageNumber = 0;
	
	// The number of the last image in the sequence
	this.lastImageNumber = 0;
	
	// The number of the image currently being displayed
	this.currentImage = 0;
	
	// Indicates whether or not the animation repeats
	this.repeat = true;
	
	// Indicates whether or not the animation is currently active
	this.animationRunning = false;
	
	// Indicates whether or not the animation has been displayed
	// on the page
	this.animationDrawn = false;

	/** FUNCTIONS **/
	
	// Draw the animation after it has been set up
    // Setting delayStart to true will prevent the animation from starting -
    // it can be started manually by calling startAnimation
	this.draw = function(delayStart)
		{
		// Draw the first image html, then call doDraw to continue
		var html = new Array();
		html[html.length] = '<img id="' + this.animName + '" src=""';
		if (this.altText)
			html[html.length] = ' alt="' + this.altText + '"';
		if (this.titleText)
			html[html.length] = ' title="' + this.titleText + '"';
		
		html[html.length] = '/>';

		document.write(html.join(''));
		document.getElementById(this.animName).src = this.images[this.firstImageNumber].src;
		
        if (!delayStart)
            {
            setTimeout('animatedPNGs[\'' + this.animName + '\'].drawFrame()', this.delays[this.firstImageNumber]);
            this.animationRunning = true;
            }

        this.drawn = true;
		}
		
	// Set the delay for a specific frame in the animation.
	//   frame - The frame number
	//   delay - The delay in milliseconds
	//
	// If the frame number does not correspond to a frame in the animation,
	// this will have no effect.
	this.setFrameDelay = function(frame, delay)
		{
		this.delays[frame] = delay;
		}
		
	// Indicate whether or not the animation should repeat.
	// If the animation has been drawn, but is not running,
	// it will be started automatically.
	//   repeat - Flag to indicate whether or not the animation should repeat.
	this.setRepeat = function(repeat)
		{
		this.repeat = repeat;
		if (repeat && !this.animationRunning)
			this.startAnimation();
		}
		
	// Starts or resumes the animation if it is not running.
	this.startAnimation = function()
		{
		if (!this.animationRunning)
			{
			this.animationRunning = true;
			this.drawFrame();
			}
		}
		
	// Stops the animation at the current frame.
	this.stopAnimation = function()
		{
		this.animationRunning = false;
		}
		
	// Draws a single frame of the animation.
	// This is an internal function, and should not
	// be called directly.
	this.drawFrame = function()
		{
		var drawImage = true;
		this.currentImage++;

		// If the frame is past the last image in the sequence,
		// either return to the start of the animation (if repeating),
		// or stop.
		if (this.currentImage > this.lastImageNumber)
			{
			if (this.repeat)
				this.currentImage = this.firstImageNumber;
			else
				{
				drawImage = false;
				this.animationRunning = false;
				}
			}
			
		// If we're going to draw the frame....
		if (drawImage)
			{
			// Draw the frame in the HTML documemt
			document.getElementById(this.animName).src = this.images[this.currentImage].src;
			
			// Calculate the delay before drawing the next frame
			if (this.delays[this.currentImage])
				delay = this.delays[this.currentImage];
			
			// Draw the next frame after the calculated delay
			if (this.animationRunning)
				setTimeout('animatedPNGs[\'' + this.animName + '\'].drawFrame()', delay);
			}
		}
	
	
	
	/** CONSTRUCTOR **/
	
	var head = null;
	var numbers = '';

	// Check that the suffix for the image is .png
	var suffix = firstImage.substring(firstImage.length - 4, firstImage.length);
	if (suffix.search(/\.png/i) != 0 && suffix.search(/\.jpg/i) != 0)
		throw 'Invalid suffix for first image in animated PNG ' + imageName + ' - must be .png or .jpg';

	// Extract the number from the filename
	var finishedNumbers = false;
	var curIndex = firstImage.length - 5;
	for (; curIndex >= 0 && !finishedNumbers; curIndex--)
		{
		if (/[0-9]/.test(firstImage.charAt(curIndex)))
			{
			numbers = firstImage.charAt(curIndex) + numbers;
			if (firstImage.charAt(curIndex) == '0')
				this.padCount++;
			}
		else
			finishedNumbers = true;
		}

	// Extract the number of the first image from the filename
	numbers = parseInt(numbers);
	this.firstImageNumber = numbers;
	this.currentImage = numbers;
	head = firstImage.substring(0, curIndex + 2);
		
	// Build the array of images
	for (var i = numbers; i < imageCount + numbers; i++)
		{
		this.images[i] = new Image;
		this.images[i].src = head + pad(i, this.padCount) + suffix;
		this.lastImageNumber = i;
		this.delays[i] = delay;
		}
		
	// Add ourselves to the list of known animated PNGs
	animatedPNGs[imageName] = this;
	}
	
// Zero-pads a number to a specified length
//   number - The number to be padded
//   padCount - The length of the padded number
function pad(number, padCount)
	{
	var result = '' + number;
	while (result.length < padCount + 1)
		result = '0' + result;
	
	return result;
	}