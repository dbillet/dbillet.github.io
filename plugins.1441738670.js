/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery)
}(function(a) {
    function b(b) {
        var g = b || window.event, h = i.call(arguments, 1), j = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
        if (b = a.event.fix(g), b.type = "mousewheel", "detail"in g && (m =- 1 * g.detail), "wheelDelta"in g && (m = g.wheelDelta), "wheelDeltaY"in g && (m = g.wheelDeltaY), "wheelDeltaX"in g && (l =- 1 * g.wheelDeltaX), "axis"in g && g.axis === g.HORIZONTAL_AXIS && (l =- 1 * m, m = 0), j = 0 === m ? l : m, "deltaY"in g && (m =- 1 * g.deltaY, j = m), "deltaX"in g && (l = g.deltaX, 0 === m && (j =- 1 * l)), 0 !== m || 0 !== l) {
            if (1 === g.deltaMode) {
                var q = a.data(this, "mousewheel-line-height");
                j*=q, m*=q, l*=q
            } else if (2 === g.deltaMode) {
                var r = a.data(this, "mousewheel-page-height");
                j*=r, m*=r, l*=r
            }
            if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f/=40)), d(g, n) && (j/=40, l/=40, m/=40), j = Math[j >= 1 ? "floor": "ceil"](j / f), l = Math[l >= 1 ? "floor": "ceil"](l / f), m = Math[m >= 1 ? "floor": "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) {
                var s = this.getBoundingClientRect();
                o = b.clientX - s.left, p = b.clientY - s.top
            }
            return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h)
        }
    }
    function c() {
        f = null
    }
    function d(a, b) {
        return k.settings.adjustOldDeltas && "mousewheel" === a.type && b%120 === 0
    }
    var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], h = "onwheel"in document || document.documentMode >= 9 ? ["wheel"]: ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], i = Array.prototype.slice;
    if (a.event.fixHooks)
        for (var j = g.length; j;)
            a.event.fixHooks[g[--j]] = a.event.mouseHooks;
    var k = a.event.special.mousewheel = {
        version: "3.1.12",
        setup: function() {
            if (this.addEventListener)
                for (var c = h.length; c;)
                    this.addEventListener(h[--c], b, !1);
            else
                this.onmousewheel = b;
            a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this))
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var c = h.length; c;)
                    this.removeEventListener(h[--c], b, !1);
            else
                this.onmousewheel = null;
            a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height")
        },
        getLineHeight: function(b) {
            var c = a(b), d = c["offsetParent"in a.fn ? "offsetParent": "parent"]();
            return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16
        },
        getPageHeight: function(b) {
            return a(b).height()
        },
        settings: {
            adjustOldDeltas: !0,
            normalizeOffset: !0
        }
    };
    a.fn.extend({
        mousewheel: function(a) {
            return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
        },
        unmousewheel: function(a) {
            return this.unbind("mousewheel", a)
        }
    })
});

/*
Stripped down version of scrollConverter 1.0
https://github.com/koggdal/scroll-converter

Copyright 2011 Johannes Koggdal (http://koggdal.com/)
Modified by Aart Röst (http://cargocollective.com/)

Released under MIT license
*/

!function(factory) {
    "function" == typeof define && define.amd ? define(["jquery"], factory) : "object" == typeof exports ? module.exports = factory(require("jquery")) : factory(jQuery)
}(function($) {
    var dispatch = $.event.dispatch || $.event.handle, special = $.event.special, uid1 = "D" + + new Date, uid2 = "D" + ( + new Date + 1);
    special.scrollstart = {
        setup: function(data) {
            var timer, _data = $.extend({
                latency: special.scrollstop.latency
            }, data), handler = function(evt) {
                var _self = this, _args = arguments;
                timer ? clearTimeout(timer) : (evt.type = "scrollstart", dispatch.apply(_self, _args)), timer = setTimeout(function() {
                    timer = null
                }, _data.latency)
            };
            $(this).bind("scroll", handler).data(uid1, handler)
        },
        teardown: function() {
            $(this).unbind("scroll", $(this).data(uid1))
        }
    }, special.scrollstop = {
        latency: 250,
        setup: function(data) {
            var timer, _data = $.extend({
                latency: special.scrollstop.latency
            }, data), handler = function(evt) {
                var _self = this, _args = arguments;
                timer && clearTimeout(timer), timer = setTimeout(function() {
                    timer = null, evt.type = "scrollstop", dispatch.apply(_self, _args)
                }, _data.latency)
            };
            $(this).bind("scroll", handler).data(uid2, handler)
        },
        teardown: function() {
            $(this).unbind("scroll", $(this).data(uid2))
        }
    }
});

window.hijackScroll = (function(window, document) {
    var active = false,
    hasDeactivated = false,
    eventsBound = false;
    var scrollCallback = function(event, callback) {
        if (!active) {
            return;
        }
        var delta, numPixelsPerStep, change;
        delta = 0;
        numPixelsPerStep = 10;
        if (event.detail) {
            delta = event.detail * - 240;
        } else {
            if (event.wheelDelta) {
                delta = event.wheelDelta * 5;
            }
        }
        change = delta / 120 * numPixelsPerStep;
        if (typeof callback === "function") {
            callback(change);
        }
    },
    bindEvents = function(cb) {
        var callback = function(e) {
            e = e || window.event;
            scrollCallback(e, cb);
            if (e.preventDefault && e.stopPropagation) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                return false;
            }
        },
        updateOnScrollBar = function(a, b, c) {};
        if (window.addEventListener) {
            if ("onmousewheel" in window) {
                window.addEventListener("mousewheel", callback, false);
                window.addEventListener("scroll", updateOnScrollBar, false);
            } else {
                window.addEventListener("DOMMouseScroll", callback, false);
                window.addEventListener("scroll", updateOnScrollBar, false);
            }
        } else {
            document.attachEvent("onmousewheel", callback);
            window.attachEvent("onscroll", updateOnScrollBar);
        }
    },
    deactivateScrolling = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    return {
        activate: function(callback) {
            active = true;
            if (!eventsBound) {
                bindEvents(callback);
                eventsBound = true;
            }
            if (hasDeactivated) {
                if (window.addEventListener) {
                    window.removeEventListener("scroll", deactivateScrolling, true);
                } else {
                    window.detachEvent("onscroll", deactivateScrolling);
                }
                hasDeactivated = false;
            }
        },
        deactivate: function() {
            active = false;
        },
        deactivateAllScrolling: function() {
            active = false;
            hasDeactivated = true;
            if (window.addEventListener) {
                window.addEventListener("scroll", deactivateScrolling, true);
            } else {
                window.attachEvent("onscroll", deactivateScrolling);
            }
        }
    };
}(window, document));


/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function() {
    function e() {}
    function t(e, t) {
        for (var n = e.length; n--;)
            if (e[n].listener === t)
                return n;
        return - 1
    }
    function n(e) {
        return function() {
            return this[e].apply(this, arguments)
        }
    }
    var i = e.prototype, r = this, o = r.EventEmitter;
    i.getListeners = function(e) {
        var t, n, i = this._getEvents();
        if ("object" == typeof e) {
            t = {};
            for (n in i)
                i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n])
        } else
            t = i[e] || (i[e] = []);
        return t
    }, i.flattenListeners = function(e) {
        var t, n = [];
        for (t = 0; e.length > t; t += 1)
            n.push(e[t].listener);
        return n
    }, i.getListenersAsObject = function(e) {
        var t, n = this.getListeners(e);
        return n instanceof Array && (t = {}, t[e] = n), t || n
    }, i.addListener = function(e, n) {
        var i, r = this.getListenersAsObject(e), o = "object" == typeof n;
        for (i in r)
            r.hasOwnProperty(i)&&-1 === t(r[i], n) && r[i].push(o ? n : {
                listener: n,
                once: !1
            });
        return this
    }, i.on = n("addListener"), i.addOnceListener = function(e, t) {
        return this.addListener(e, {
            listener: t,
            once: !0
        })
    }, i.once = n("addOnceListener"), i.defineEvent = function(e) {
        return this.getListeners(e), this
    }, i.defineEvents = function(e) {
        for (var t = 0; e.length > t; t += 1)
            this.defineEvent(e[t]);
        return this
    }, i.removeListener = function(e, n) {
        var i, r, o = this.getListenersAsObject(e);
        for (r in o)
            o.hasOwnProperty(r) && (i = t(o[r], n), - 1 !== i && o[r].splice(i, 1));
        return this
    }, i.off = n("removeListener"), i.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t)
    }, i.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t)
    }, i.manipulateListeners = function(e, t, n) {
        var i, r, o = e ? this.removeListener: this.addListener, s = e ? this.removeListeners: this.addListeners;
        if ("object" != typeof t || t instanceof RegExp)
            for (i = n.length; i--;)
                o.call(this, t, n[i]);
        else
            for (i in t)
                t.hasOwnProperty(i) && (r = t[i]) && ("function" == typeof r ? o.call(this, i, r) : s.call(this, i, r));
        return this
    }, i.removeEvent = function(e) {
        var t, n = typeof e, i = this._getEvents();
        if ("string" === n)
            delete i[e];
        else if ("object" === n)
            for (t in i)
                i.hasOwnProperty(t) && e.test(t) && delete i[t];
        else
            delete this._events;
        return this
    }, i.removeAllListeners = n("removeEvent"), i.emitEvent = function(e, t) {
        var n, i, r, o, s = this.getListenersAsObject(e);
        for (r in s)
            if (s.hasOwnProperty(r))
                for (i = s[r].length; i--;)
                    n = s[r][i], n.once===!0 && this.removeListener(e, n.listener), o = n.listener.apply(this, t || []), o === this._getOnceReturnValue() && this.removeListener(e, n.listener);
        return this
    }, i.trigger = n("emitEvent"), i.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t)
    }, i.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e, this
    }, i._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, i._getEvents = function() {
        return this._events || (this._events = {})
    }, e.noConflict = function() {
        return r.EventEmitter = o, e
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return e
    }) : "object" == typeof module && module.exports ? module.exports = e : this.EventEmitter = e
}).call(this), function(e) {
    function t(t) {
        var n = e.event;
        return n.target = n.target || n.srcElement || t, n
    }
    var n = document.documentElement, i = function() {};
    n.addEventListener ? i = function(e, t, n) {
        e.addEventListener(t, n, !1)
    } : n.attachEvent && (i = function(e, n, i) {
        e[n + i] = i.handleEvent ? function() {
            var n = t(e);
            i.handleEvent.call(i, n)
        } : function() {
            var n = t(e);
            i.call(e, n)
        }, e.attachEvent("on" + n, e[n + i])
    });
    var r = function() {};
    n.removeEventListener ? r = function(e, t, n) {
        e.removeEventListener(t, n, !1)
    } : n.detachEvent && (r = function(e, t, n) {
        e.detachEvent("on" + t, e[t + n]);
        try {
            delete e[t + n]
        } catch (i) {
            e[t + n] = void 0
        }
    });
    var o = {
        bind: i,
        unbind: r
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", o) : e.eventie = o
}(this), function(e, t) {
    "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function(n, i) {
        return t(e, n, i)
    }) : "object" == typeof exports ? module.exports = t(e, require("wolfy87-eventemitter"), require("eventie")) : e.imagesLoaded = t(e, e.EventEmitter, e.eventie)
}(window, function(e, t, n) {
    function i(e, t) {
        for (var n in t)
            e[n] = t[n];
        return e
    }
    function r(e) {
        return "[object Array]" === d.call(e)
    }
    function o(e) {
        var t = [];
        if (r(e))
            t = e;
        else if ("number" == typeof e.length)
            for (var n = 0, i = e.length; i > n; n++)
                t.push(e[n]);
        else
            t.push(e);
        return t
    }
    function s(e, t, n) {
        if (!(this instanceof s))
            return new s(e, t);
        "string" == typeof e && (e = document.querySelectorAll(e)), this.elements = o(e), this.options = i({}, this.options), "function" == typeof t ? n = t : i(this.options, t), n && this.on("always", n), this.getImages(), a && (this.jqDeferred = new a.Deferred);
        var r = this;
        setTimeout(function() {
            r.check()
        })
    }
    function f(e) {
        this.img = e
    }
    function c(e) {
        this.src = e, v[e] = this
    }
    var a = e.jQuery, u = e.console, h = u !== void 0, d = Object.prototype.toString;
    s.prototype = new t, s.prototype.options = {}, s.prototype.getImages = function() {
        this.images = [];
        for (var e = 0, t = this.elements.length; t > e; e++) {
            var n = this.elements[e];
            "IMG" === n.nodeName && this.addImage(n);
            var i = n.nodeType;
            if (i && (1 === i || 9 === i || 11 === i))
                for (var r = n.querySelectorAll("img"), o = 0, s = r.length; s > o; o++) {
                    var f = r[o];
                    this.addImage(f)
                }
            }
    }, s.prototype.addImage = function(e) {
        var t = new f(e);
        this.images.push(t)
    }, s.prototype.check = function() {
        function e(e, r) {
            return t.options.debug && h && u.log("confirm", e, r), t.progress(e), n++, n === i && t.complete(), !0
        }
        var t = this, n = 0, i = this.images.length;
        if (this.hasAnyBroken=!1, !i)
            return this.complete(), void 0;
        for (var r = 0; i > r; r++) {
            var o = this.images[r];
            o.on("confirm", e), o.check()
        }
    }, s.prototype.progress = function(e) {
        this.hasAnyBroken = this.hasAnyBroken ||!e.isLoaded;
        var t = this;
        setTimeout(function() {
            t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify && t.jqDeferred.notify(t, e)
        })
    }, s.prototype.complete = function() {
        var e = this.hasAnyBroken ? "fail": "done";
        this.isComplete=!0;
        var t = this;
        setTimeout(function() {
            if (t.emit(e, t), t.emit("always", t), t.jqDeferred) {
                var n = t.hasAnyBroken ? "reject": "resolve";
                t.jqDeferred[n](t)
            }
        })
    }, a && (a.fn.imagesLoaded = function(e, t) {
        var n = new s(this, e, t);
        return n.jqDeferred.promise(a(this))
    }), f.prototype = new t, f.prototype.check = function() {
        var e = v[this.img.src] || new c(this.img.src);
        if (e.isConfirmed)
            return this.confirm(e.isLoaded, "cached was confirmed"), void 0;
        if (this.img.complete && void 0 !== this.img.naturalWidth)
            return this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), void 0;
        var t = this;
        e.on("confirm", function(e, n) {
            return t.confirm(e.isLoaded, n), !0
        }), e.check()
    }, f.prototype.confirm = function(e, t) {
        this.isLoaded = e, this.emit("confirm", this, t)
    };
    var v = {};
    return c.prototype = new t, c.prototype.check = function() {
        if (!this.isChecked) {
            var e = new Image;
            n.bind(e, "load", this), n.bind(e, "error", this), e.src = this.src, this.isChecked=!0
        }
    }, c.prototype.handleEvent = function(e) {
        var t = "on" + e.type;
        this[t] && this[t](e)
    }, c.prototype.onload = function(e) {
        this.confirm(!0, "onload"), this.unbindProxyEvents(e)
    }, c.prototype.onerror = function(e) {
        this.confirm(!1, "onerror"), this.unbindProxyEvents(e)
    }, c.prototype.confirm = function(e, t) {
        this.isConfirmed=!0, this.isLoaded = e, this.emit("confirm", this, t)
    }, c.prototype.unbindProxyEvents = function(e) {
        n.unbind(e.target, "load", this), n.unbind(e.target, "error", this)
    }, s
});
