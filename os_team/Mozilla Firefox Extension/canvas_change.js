(function (window) {
	"use strict";
var CanvasLoader = function (id, opt) {
		if (typeof(opt) == "undefined") { opt = {}; }
		this.init(id, opt);
	}, p = CanvasLoader.prototype, engine, engines = ["canvas", "vml"], shapes = ["oval", "spiral", "square", "rect", "roundRect"], cRX = /^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, ie8 = navigator.appVersion.indexOf("MSIE") !== -1 && parseFloat(navigator.appVersion.split("MSIE")[1]) === 8 ? true : false, canSup = !!document.createElement('canvas').getContext, safeDensity = 40, safeVML = true,
	addEl = function (tag, par, opt) {
			var el = document.createElement(tag), n;
			for (n in opt) { el[n] = opt[n]; }
			if(typeof(par) !== "undefined") {
				par.appendChild(el);
			}
			return el;
		},
		setCSS = function (el, opt) {
			for (var n in opt) { el.style[n] = opt[n]; }
			return el;
		},
		setAttr = function (el, opt) {
			for (var n in opt) { el.setAttribute(n, opt[n]); }
			return el;
		},
		transCon = function(c, x, y, r) {
			c.save();
			c.translate(x, y);
			c.rotate(r);
			c.translate(-x, -y);
			c.beginPath();
		};
		p.init = function (pId, opt) {
		
		if (typeof(opt.safeVML) === "boolean") { safeVML = opt.safeVML; }
		
		try {
			// Look for the parent element
			if (document.getElementById(pId) !== undefined) {
				this.mum = document.getElementById(pId);
			} else {
				this.mum = document.body;
			}
		} catch (error) {
			this.mum = document.body;
		}
		// Creates the parent div of the loader instance
		opt.id = typeof (opt.id) !== "undefined" ? opt.id : "canvasLoader";
		this.cont = addEl("div", this.mum, {id: opt.id});
		if (canSup) {
		// For browsers with Canvas support...
			engine = engines[0];
			// Create the canvas element
			this.can = addEl("canvas", this.cont);
			this.con = this.can.getContext("2d");
			// Create the cache canvas element
			this.cCan = setCSS(addEl("canvas", this.cont), { display: "none" });
			this.cCon = this.cCan.getContext("2d");
		} else {
			// For browsers without Canvas support...
			engine = engines[1];
			// Adds the VML stylesheet
			if (typeof (CanvasLoader.vmlSheet) === "undefined") {
				document.getElementsByTagName("head")[0].appendChild(addEl("style"));
				CanvasLoader.vmlSheet = document.styleSheets[document.styleSheets.length - 1];
				var a = ["group", "oval", "roundrect", "fill"], n;
				for ( var n = 0; n < a.length; ++n ) { CanvasLoader.vmlSheet.addRule(a[n], "behavior:url(#default#VML); position:absolute;"); }
			}
			this.vml = addEl("group", this.cont);
		}
		// Set the RGB color object
		this.setColor(this.color);
		// Draws the shapes on the canvas
		this.draw();
		//Hides the preloader
		setCSS(this.cont, {display: "none"});
	};
	p.cont = {};
	p.can = {};
	p.con = {};
	p.cCan = {};
	p.cCon = {};
	p.timer = {};
	p.activeId = 0;
	p.diameter = 40;
	p.setDiameter = function (diameter) { this.diameter = Math.round(Math.abs(diameter)); this.redraw(); };
	p.getDiameter = function () { return this.diameter; };
	p.cRGB = {};
	p.color = "#000000";
	p.setColor = function (color) { this.color = cRX.test(color) ? color : "#000000"; this.cRGB = this.getRGB(this.color); this.redraw(); };
	p.getColor = function () { return this.color; };
	p.shape = shapes[0];
	p.setShape = function (shape) {
		var n;
		for (n in shapes) {
			if (shape === shapes[n]) { this.shape = shape; this.redraw(); break; }
		}
	};
	p.getShape = function () { return this.shape; };
	p.density = 40;
	p.setDensity = function (density) { 
		if (safeVML && engine === engines[1]) {
			this.density = Math.round(Math.abs(density)) <= safeDensity ? Math.round(Math.abs(density)) : safeDensity;
		} else {
			this.density = Math.round(Math.abs(density));
		}
		if (this.density > 360) { this.density = 360; }
		this.activeId = 0;
		this.redraw();
	};
	p.getDensity = function () { return this.density; };
	p.range = 1.3;
	p.setRange = function (range) { this.range = Math.abs(range); this.redraw(); };
	p.getRange = function () { return this.range; };
	p.speed = 2;
	p.setSpeed = function (speed) { this.speed = Math.round(Math.abs(speed)); };
	p.getSpeed = function () { return this.speed; };
	p.fps = 24;
	p.setFPS = function (fps) { this.fps = Math.round(Math.abs(fps)); this.reset(); };
	p.getFPS = function () { return this.fps; };
	p.getRGB = function (c) {
		c = c.charAt(0) === "#" ? c.substring(1, 7) : c;
		return {r: parseInt(c.substring(0, 2), 16), g: parseInt(c.substring(2, 4), 16), b: parseInt(c.substring(4, 6), 16) };
	};
	p.draw = function () {
		var i = 0, size, w, h, x, y, ang, rads, rad, de = this.density, animBits = Math.round(de * this.range), bitMod, minBitMod = 0, s, g, sh, f, d = 1000, arc = 0, c = this.cCon, di = this.diameter, e = 0.47;
		if (engine === engines[0]) {
			c.clearRect(0, 0, d, d);
			setAttr(this.can, {width: di, height: di});
			setAttr(this.cCan, {width: di, height: di});
			while (i < de) {
				bitMod = i <= animBits ? 1 - ((1 - minBitMod) / animBits * i) : bitMod = minBitMod;
				ang = 270 - 360 / de * i;
				rads = ang / 180 * Math.PI;
				c.fillStyle = "rgba(" + this.cRGB.r + "," + this.cRGB.g + "," + this.cRGB.b + "," + bitMod.toString() + ")";
				switch (this.shape) {
				case shapes[0]:
				case shapes[1]:
					size = di * 0.07;
					x = di * e + Math.cos(rads) * (di * e - size) - di * e;
					y = di * e + Math.sin(rads) * (di * e - size) - di * e;
					c.beginPath();
					if (this.shape === shapes[1]) { c.arc(di * 0.5 + x, di * 0.5 + y, size * bitMod, 0, Math.PI * 2, false); } else { c.arc(di * 0.5 + x, di * 0.5 + y, size, 0, Math.PI * 2, false); }
					break;
				case shapes[2]:
					size = di * 0.12;
					x = Math.cos(rads) * (di * e - size) + di * 0.5;
					y = Math.sin(rads) * (di * e - size) + di * 0.5;
					transCon(c, x, y, rads);
					c.fillRect(x, y - size * 0.5, size, size);
					break;
				case shapes[3]:
				case shapes[4]:
					w = di * 0.3;
					h = w * 0.27;
					x = Math.cos(rads) * (h + (di - h) * 0.13) + di * 0.5;
					y = Math.sin(rads) * (h + (di - h) * 0.13) + di * 0.5;
					transCon(c, x, y, rads);
					if(this.shape === shapes[3]) {
						c.fillRect(x, y - h * 0.5, w, h);
					} else {
						rad = h * 0.55;
						c.moveTo(x + rad, y - h * 0.5);
						c.lineTo(x + w - rad, y - h * 0.5);
						c.quadraticCurveTo(x + w, y - h * 0.5, x + w, y - h * 0.5 + rad);
						c.lineTo(x + w, y - h * 0.5 + h - rad);
						c.quadraticCurveTo(x + w, y - h * 0.5 + h, x + w - rad, y - h * 0.5 + h);
						c.lineTo(x + rad, y - h * 0.5 + h);
						c.quadraticCurveTo(x, y - h * 0.5 + h, x, y - h * 0.5 + h - rad);
						c.lineTo(x, y - h * 0.5 + rad);
						c.quadraticCurveTo(x, y - h * 0.5, x + rad, y - h * 0.5);
					}
					break;
				}
				c.closePath();
				c.fill();
				c.restore();
				++i;
			}
		} else {
			setCSS(this.cont, {width: di, height: di});
			setCSS(this.vml, {width: di, height: di});
			switch (this.shape) {
			case shapes[0]:
			case shapes[1]:
				sh = "oval";
				size = d * 0.14;
				break;
			case shapes[2]:
				sh = "roundrect";
				size = d * 0.12;
				break;
			case shapes[3]:
			case shapes[4]:
				sh = "roundrect";
				size = d * 0.3;
				break;
			}
			w = h = size;
			x = d * 0.5 - h;
			y = -h * 0.5;		
			while (i < de) {
				bitMod = i <= animBits ? 1 - ((1 - minBitMod) / animBits * i) : bitMod = minBitMod;
				ang = 270 - 360 / de * i;
				switch (this.shape) {
				case shapes[1]:
					w = h = size * bitMod;
					x = d * 0.5 - size * 0.5 - size * bitMod * 0.5;
					y = (size - size * bitMod) * 0.5;
					break;
				case shapes[0]:
				case shapes[2]:
					if (ie8) {
						y = 0;
						if(this.shape === shapes[2]) {
							x = d * 0.5 -h * 0.5;
						}
					}
					break;
				case shapes[3]:
				case shapes[4]:
					w = size * 0.95;
					h = w * 0.28;
					if (ie8) {
						x = 0;
						y = d * 0.5 - h * 0.5;
					} else {
						x = d * 0.5 - w;
						y = -h * 0.5;
					}
					arc = this.shape === shapes[4] ? 0.6 : 0; 
					break;
				}
				g = setAttr(setCSS(addEl("group", this.vml), {width: d, height: d, rotation: ang}), {coordsize: d + "," + d, coordorigin: -d * 0.5 + "," + (-d * 0.5)});
				s = setCSS(addEl(sh, g, {stroked: false, arcSize: arc}), { width: w, height: h, top: y, left: x});
				f = addEl("fill", s, {color: this.color, opacity: bitMod});
				++i;
			}
		}
		this.tick(true);
	};
	/**
	* Cleans the canvas
	* @method clean
	* @protected
	*/
	p.clean = function () {
		if (engine === engines[0]) {
			this.con.clearRect(0, 0, 1000, 1000);
		} else {
			var v = this.vml;
			if (v.hasChildNodes()) {
				while (v.childNodes.length >= 1) {
					v.removeChild(v.firstChild);
				}
			}
		}
	};
	/**
	* Redraws the canvas
	* @method redraw
	* @protected
	*/
	p.redraw = function () {
			this.clean();
			this.draw();
	};
	/**
		* Resets the timer
		* @method reset
		* @protected
		*/
		p.reset = function () {
			if (typeof (this.timer) === "number") {
				this.hide();
				this.show();
			}
		};
	/**
	* Renders the loader animation
	* @method tick
	* @protected
	*/
	p.tick = function (init) {
		var c = this.con, di = this.diameter;
		if (!init) { this.activeId += 360 / this.density * this.speed; }
		if (engine === engines[0]) {
			c.clearRect(0, 0, di, di);
			transCon(c, di * 0.5, di * 0.5, this.activeId / 180 * Math.PI);
			c.drawImage(this.cCan, 0, 0, di, di);
			c.restore();
		} else {
			if (this.activeId >= 360) { this.activeId -= 360; }
			setCSS(this.vml, {rotation:this.activeId});
		}
	};
	/**
	* Shows the rendering of the loader animation
	* @method show
	* @public
	*/
	p.show = function () {
		if (typeof (this.timer) !== "number") {
			var t = this;
			this.timer = self.setInterval(function () { t.tick(); }, Math.round(1000 / this.fps));
			setCSS(this.cont, {display: "block"});
		}
	};
	/**
	* Stops the rendering of the loader animation and hides the loader
	* @method hide
	* @public
	*/
	p.hide = function () {
		if (typeof (this.timer) === "number") {
			clearInterval(this.timer);			
			delete this.timer;
			setCSS(this.cont, {display: "none"});
		}
	};
	/**
	* Removes the CanvasLoader instance and all its references
	* @method kill
	* @public
	*/
	p.kill = function () {
		var c = this.cont;
		if (typeof (this.timer) === "number") { this.hide(); }
		if (engine === engines[0]) {
			c.removeChild(this.can);
			c.removeChild(this.cCan);
		} else {
			c.removeChild(this.vml);
		}
		var n;
		for (n in this) { delete this[n]; }
	};
	window.CanvasLoader = CanvasLoader;
}(window));
	
	
