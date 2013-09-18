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
animatedPNGs=new Array();function AnimatedPNG(imageName,firstImage,imageCount,delay)
{this.animName=imageName;this.images=new Array();this.delays=new Array();this.padCount=0;this.firstImageNumber=0;this.lastImageNumber=0;this.currentImage=0;this.repeat=true;this.animationRunning=false;this.animationDrawn=false;this.draw=function(delayStart)
{var html=new Array();html[html.length]='<img id="'+this.animName+'" src=""';if(this.altText)
html[html.length]=' alt="'+this.altText+'"';if(this.titleText)
html[html.length]=' title="'+this.titleText+'"';html[html.length]='/>';document.write(html.join(''));document.getElementById(this.animName).src=this.images[this.firstImageNumber].src;if(!delayStart)
{setTimeout('animatedPNGs[\''+this.animName+'\'].drawFrame()',this.delays[this.firstImageNumber]);this.animationRunning=true;}
this.drawn=true;}
this.setFrameDelay=function(frame,delay)
{this.delays[frame]=delay;}
this.setRepeat=function(repeat)
{this.repeat=repeat;if(repeat&&!this.animationRunning)
this.startAnimation();}
this.startAnimation=function()
{if(!this.animationRunning)
{this.animationRunning=true;this.drawFrame();}}
this.stopAnimation=function()
{this.animationRunning=false;}
this.drawFrame=function()
{var drawImage=true;this.currentImage++;if(this.currentImage>this.lastImageNumber)
{if(this.repeat)
this.currentImage=this.firstImageNumber;else
{drawImage=false;this.animationRunning=false;}}
if(drawImage)
{document.getElementById(this.animName).src=this.images[this.currentImage].src;if(this.delays[this.currentImage])
delay=this.delays[this.currentImage];if(this.animationRunning)
setTimeout('animatedPNGs[\''+this.animName+'\'].drawFrame()',delay);}}
var head=null;var numbers='';var suffix=firstImage.substring(firstImage.length-4,firstImage.length);if(suffix.search(/\.png/i)!=0&&suffix.search(/\.jpg/i)!=0)
throw'Invalid suffix for first image in animated PNG '+imageName+' - must be .png or .jpg';var finishedNumbers=false;var curIndex=firstImage.length-5;for(;curIndex>=0&&!finishedNumbers;curIndex--)
{if(/[0-9]/.test(firstImage.charAt(curIndex)))
{numbers=firstImage.charAt(curIndex)+numbers;if(firstImage.charAt(curIndex)=='0')
this.padCount++;}
else
finishedNumbers=true;}
numbers=parseInt(numbers);this.firstImageNumber=numbers;this.currentImage=numbers;head=firstImage.substring(0,curIndex+2);for(var i=numbers;i<imageCount+numbers;i++)
{this.images[i]=new Image;this.images[i].src=head+pad(i,this.padCount)+suffix;this.lastImageNumber=i;this.delays[i]=delay;}
animatedPNGs[imageName]=this;}
function pad(number,padCount)
{var result=''+number;while(result.length<padCount+1)
result='0'+result;return result;}