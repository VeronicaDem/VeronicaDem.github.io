/**
 * Copyright (c) 2011-2013 Felix Gnass
 * Licensed under the MIT license
 */
//fgnass.github.com/spin.js#v1.3.2
/*(function(root,factory){if(typeof exports=="object"){module.exports=factory()}else{if(typeof define=="function"&&define.amd){define(factory)}else{root.Spinner=factory()}}}(this,function(){var prefixes=["webkit","Moz","ms","O"],animations={},useCssAnimations;function createEl(tag,prop){var el=document.createElement(tag||"div"),n;for(n in prop){el[n]=prop[n]}return el}function ins(parent){for(var i=1,n=arguments.length;i<n;i++){parent.appendChild(arguments[i])}return parent}var sheet=(function(){var el=createEl("style",{type:"text/css"});ins(document.getElementsByTagName("head")[0],el);return el.sheet||el.styleSheet}());function addAnimation(alpha,trail,i,lines){var name=["opacity",trail,~~(alpha*100),i,lines].join("-"),start=0.01+i/lines*100,z=Math.max(1-(1-alpha)/trail*(100-start),alpha),prefix=useCssAnimations.substring(0,useCssAnimations.indexOf("Animation")).toLowerCase(),pre=prefix&&"-"+prefix+"-"||"";if(!animations[name]){sheet.insertRule("@"+pre+"keyframes "+name+"{0%{opacity:"+z+"}"+start+"%{opacity:"+alpha+"}"+(start+0.01)+"%{opacity:1}"+(start+trail)%100+"%{opacity:"+alpha+"}100%{opacity:"+z+"}}",sheet.cssRules.length);animations[name]=1}return name}function vendor(el,prop){var s=el.style,pp,i;prop=prop.charAt(0).toUpperCase()+prop.slice(1);for(i=0;i<prefixes.length;i++){pp=prefixes[i]+prop;if(s[pp]!==undefined){return pp}}if(s[prop]!==undefined){return prop}}function css(el,prop){for(var n in prop){el.style[vendor(el,n)||n]=prop[n]}return el}function merge(obj){for(var i=1;i<arguments.length;i++){var def=arguments[i];for(var n in def){if(obj[n]===undefined){obj[n]=def[n]}}}return obj}function pos(el){var o={x:el.offsetLeft,y:el.offsetTop};while((el=el.offsetParent)){o.x+=el.offsetLeft,o.y+=el.offsetTop}return o}function getColor(color,idx){return typeof color=="string"?color:color[idx%color.length]}var defaults={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:1/4,fps:20,zIndex:"auto",className:"spinner",top:"auto",left:"auto",position:"relative"};function Spinner(o){if(typeof this=="undefined"){return new Spinner(o)}this.opts=merge(o||{},Spinner.defaults,defaults)}Spinner.defaults={};merge(Spinner.prototype,{spin:function(target){this.stop();var self=this,o=self.opts,el=self.el=css(createEl(0,{className:o.className}),{position:o.position,width:0,zIndex:o.zIndex}),mid=o.radius+o.length+o.width,ep,tp;if(target){target.insertBefore(el,target.firstChild||null);tp=pos(target);ep=pos(el);css(el,{left:(o.left=="auto"?tp.x-ep.x+(target.offsetWidth>>1):parseInt(o.left,10)+mid)+"px",top:(o.top=="auto"?tp.y-ep.y+(target.offsetHeight>>1):parseInt(o.top,10)+mid)+"px"})}el.setAttribute("role","progressbar");self.lines(el,self.opts);if(!useCssAnimations){var i=0,start=(o.lines-1)*(1-o.direction)/2,alpha,fps=o.fps,f=fps/o.speed,ostep=(1-o.opacity)/(f*o.trail/100),astep=f/o.lines;(function anim(){i++;for(var j=0;j<o.lines;j++){alpha=Math.max(1-(i+(o.lines-j)*astep)%f*ostep,o.opacity);self.opacity(el,j*o.direction+start,alpha,o)}self.timeout=self.el&&setTimeout(anim,~~(1000/fps))})()}return self},stop:function(){var el=this.el;if(el){clearTimeout(this.timeout);if(el.parentNode){el.parentNode.removeChild(el)}this.el=undefined}return this},lines:function(el,o){var i=0,start=(o.lines-1)*(1-o.direction)/2,seg;function fill(color,shadow){return css(createEl(),{position:"absolute",width:(o.length+o.width)+"px",height:o.width+"px",background:color,boxShadow:shadow,transformOrigin:"left",transform:"rotate("+~~(360/o.lines*i+o.rotate)+"deg) translate("+o.radius+"px,0)",borderRadius:(o.corners*o.width>>1)+"px"})}for(;i<o.lines;i++){seg=css(createEl(),{position:"absolute",top:1+~(o.width/2)+"px",transform:o.hwaccel?"translate3d(0,0,0)":"",opacity:o.opacity,animation:useCssAnimations&&addAnimation(o.opacity,o.trail,start+i*o.direction,o.lines)+" "+1/o.speed+"s linear infinite"});if(o.shadow){ins(seg,css(fill("rgba(0,0,0,.25)","0 0 4px rgba(0,0,0,.5)"),{top:2+"px"}))}ins(el,ins(seg,fill(getColor(o.color,i),"0 0 1px rgba(0,0,0,.1)")))}return el},opacity:function(el,i,val){if(i<el.childNodes.length){el.childNodes[i].style.opacity=val}}});function initVML(){function vml(tag,attr){return createEl("<"+tag+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',attr)}sheet.addRule(".spin-vml","behavior:url(#default#VML)");Spinner.prototype.lines=function(el,o){var r=o.length+o.width,s=2*r;function grp(){return css(vml("group",{coordsize:s+" "+s,coordorigin:-r+" "+-r}),{width:s,height:s})}var margin=-(o.width+o.length)*2+"px",g=css(grp(),{position:"absolute",top:margin,left:margin}),i;function seg(i,dx,filter){ins(g,ins(css(grp(),{rotation:360/o.lines*i+"deg",left:~~dx}),ins(css(vml("roundrect",{arcsize:o.corners}),{width:r,height:o.width,left:o.radius,top:-o.width>>1,filter:filter}),vml("fill",{color:getColor(o.color,i),opacity:o.opacity}),vml("stroke",{opacity:0}))))}if(o.shadow){for(i=1;i<=o.lines;i++){seg(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)")}}for(i=1;i<=o.lines;i++){seg(i)}return ins(el,g)};Spinner.prototype.opacity=function(el,i,val,o){var c=el.firstChild;o=o.shadow&&o.lines||0;if(c&&i+o<c.childNodes.length){c=c.childNodes[i+o];c=c&&c.firstChild;c=c&&c.firstChild;if(c){c.opacity=val}}}}var probe=css(createEl("group"),{behavior:"url(#default#VML)"});if(!vendor(probe,"transform")&&probe.adj){initVML()}else{useCssAnimations=vendor(probe,"animation")}return Spinner}));
(function(e){if(typeof exports=="object"){e(require("jquery"),require("spin"))}else if(typeof define=="function"&&define.amd){define(["jquery","spin"],e)}else{if(!window.Spinner)throw new Error("Spin.js not present");e(window.jQuery,window.Spinner)}})(function(e,t){e.fn.spin=function(n,r){return this.each(function(){var i=e(this),s=i.data();if(s.spinner){s.spinner.stop();delete s.spinner}if(n!==false){n=e.extend({color:r||i.css("color")},e.fn.spin.presets[n]||n);s.spinner=(new t(n)).spin(this)}})};e.fn.spin.presets={tiny:{lines:8,length:2,width:2,radius:3},small:{lines:8,length:4,width:3,radius:5},large:{lines:10,length:8,width:4,radius:8}}});
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Spin = {}));
}(this, (function (exports) { 'use strict';

    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var defaults = {
        lines: 12,
        length: 7,
        width: 5,
        radius: 10,
        scale: 1.0,
        corners: 1,
        color: '#000',
        fadeColor: 'transparent',
        animation: 'spinner-line-fade-default',
        rotate: 0,
        direction: 1,
        speed: 1,
        zIndex: 2e9,
        className: 'spinner',
        top: '50%',
        left: '50%',
        shadow: '0 0 1px transparent',
        position: 'absolute',
    };
    var Spinner = /** @class */ (function () {
        function Spinner(opts) {
            if (opts === void 0) { opts = {}; }
            this.opts = __assign(__assign({}, defaults), opts);
        }
        /**
         * Adds the spinner to the given target element. If this instance is already
         * spinning, it is automatically removed from its previous target by calling
         * stop() internally.
         */
        Spinner.prototype.spin = function (target) {
            this.stop();
            this.el = document.createElement('div');
            this.el.className = this.opts.className;
            this.el.setAttribute('role', 'progressbar');
            css(this.el, {
                position: this.opts.position,
                width: 0,
                zIndex: this.opts.zIndex,
                left: this.opts.left,
                top: this.opts.top,
                transform: "scale(" + this.opts.scale + ")",
            });
            if (target) {
                target.insertBefore(this.el, target.firstChild || null);
            }
            drawLines(this.el, this.opts);
            return this;
        };
        /**
         * Stops and removes the Spinner.
         * Stopped spinners may be reused by calling spin() again.
         */
        Spinner.prototype.stop = function () {
            if (this.el) {
                if (typeof requestAnimationFrame !== 'undefined') {
                    cancelAnimationFrame(this.animateId);
                }
                else {
                    clearTimeout(this.animateId);
                }
                if (this.el.parentNode) {
                    this.el.parentNode.removeChild(this.el);
                }
                this.el = undefined;
            }
            return this;
        };
        return Spinner;
    }());
    /**
     * Sets multiple style properties at once.
     */
    function css(el, props) {
        for (var prop in props) {
            el.style[prop] = props[prop];
        }
        return el;
    }
    /**
     * Returns the line color from the given string or array.
     */
    function getColor(color, idx) {
        return typeof color == 'string' ? color : color[idx % color.length];
    }
    /**
     * Internal method that draws the individual lines.
     */
    function drawLines(el, opts) {
        var borderRadius = (Math.round(opts.corners * opts.width * 500) / 1000) + 'px';
        var shadow = 'none';
        if (opts.shadow === true) {
            shadow = '0 2px 4px #000'; // default shadow
        }
        else if (typeof opts.shadow === 'string') {
            shadow = opts.shadow;
        }
        var shadows = parseBoxShadow(shadow);
        for (var i = 0; i < opts.lines; i++) {
            var degrees = ~~(360 / opts.lines * i + opts.rotate);
            var backgroundLine = css(document.createElement('div'), {
                position: 'absolute',
                top: -opts.width / 2 + "px",
                width: (opts.length + opts.width) + 'px',
                height: opts.width + 'px',
                background: getColor(opts.fadeColor, i),
                borderRadius: borderRadius,
                transformOrigin: 'left',
                transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)",
            });
            var delay = i * opts.direction / opts.lines / opts.speed;
            delay -= 1 / opts.speed; // so initial animation state will include trail
            var line = css(document.createElement('div'), {
                width: '100%',
                height: '100%',
                background: getColor(opts.color, i),
                borderRadius: borderRadius,
                boxShadow: normalizeShadow(shadows, degrees),
                animation: 1 / opts.speed + "s linear " + delay + "s infinite " + opts.animation,
            });
            backgroundLine.appendChild(line);
            el.appendChild(backgroundLine);
        }
    }
    function parseBoxShadow(boxShadow) {
        var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
        var shadows = [];
        for (var _i = 0, _a = boxShadow.split(','); _i < _a.length; _i++) {
            var shadow = _a[_i];
            var matches = shadow.match(regex);
            if (matches === null) {
                continue; // invalid syntax
            }
            var x = +matches[2];
            var y = +matches[5];
            var xUnits = matches[4];
            var yUnits = matches[7];
            if (x === 0 && !xUnits) {
                xUnits = yUnits;
            }
            if (y === 0 && !yUnits) {
                yUnits = xUnits;
            }
            if (xUnits !== yUnits) {
                continue; // units must match to use as coordinates
            }
            shadows.push({
                prefix: matches[1] || '',
                x: x,
                y: y,
                xUnits: xUnits,
                yUnits: yUnits,
                end: matches[8],
            });
        }
        return shadows;
    }
    /**
     * Modify box-shadow x/y offsets to counteract rotation
     */
    function normalizeShadow(shadows, degrees) {
        var normalized = [];
        for (var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++) {
            var shadow = shadows_1[_i];
            var xy = convertOffset(shadow.x, shadow.y, degrees);
            normalized.push(shadow.prefix + xy[0] + shadow.xUnits + ' ' + xy[1] + shadow.yUnits + shadow.end);
        }
        return normalized.join(', ');
    }
    function convertOffset(x, y, degrees) {
        var radians = degrees * Math.PI / 180;
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        return [
            Math.round((x * cos + y * sin) * 1000) / 1000,
            Math.round((-x * sin + y * cos) * 1000) / 1000,
        ];
    }

    exports.Spinner = Spinner;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

// http://stackoverflow.com/a/21422049
(function(e){e.fn.hasScrollBar=function(){var e={},t=this.get(0);e.vertical=t.scrollHeight>t.clientHeight?true:false;e.horizontal=t.scrollWidth>t.clientWidth?true:false;return e}})(jQuery);