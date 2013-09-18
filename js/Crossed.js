var count = 0;
;(function(window, document, undefined) {
	var NAME = 'Crossed';
	function Crossed(){
		
		this.tellMe;
		//this.tell("hello "+count);

		/*this.init = function() {
		   // initMouseListeners();
			 
		}

		this.loop = function() {
			count++;
			//document.getElementById('front').innerHTML = "hello "+count;
			this.tell("hello "+ count);

		}

		this.say = function(txt) {
			document.getElementById('front').innerHTML = txt;
		}*/

	};

	Crossed.prototype.init = function() {
		setInterval(this.loop, 1000/60);
	};

	Crossed.prototype.loop = function() {
		count++;
		document.getElementById('front').innerHTML = "hello "+count;
		//this.tellMe("hello "+ count);
		
	};

	Crossed.prototype.tellMe = function() {
		document.getElementById('front').innerHTML = "yooooo";
	};

	// Expose Crossed
    window[NAME] = Crossed;
})(window, document);