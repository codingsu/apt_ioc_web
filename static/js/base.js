window.console = window.console || (function() {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {};
    return c; })();
if (typeof(String.prototype.trim) === "undefined") { String.prototype.trim = function() {
        return String(this).replace(/^\s+|\s+$/g, "") } }
jQuery.fn.localGoto = function() {
    return this.each(function() {
        var a = $(this);
        var c = a.offset();
        var b = c.top;
        $("html, body").animate({ scrollTop: b }, 500) }) };
$.fn.getData = function() {
    var e = {};
    form = $(this).serializeArray();
    for (var c = form.length; c--;) {
        var b = form[c].name;
        var d = form[c].value;
        var a = b.indexOf("[]");
        if (a > -1) { b = b.substring(0, a);
            if (!(b in e)) { e[b] = [] }
            e[b].push(d) } else { e[b] = d } }
    return e };
$.ajaxSetup({ beforeSend: function(c, b) {
        function a(d) {
            var h = null;
            if (document.cookie && document.cookie !== "") {
                var g = document.cookie.split(";");
                for (var f = 0; f < g.length; f++) {
                    var e = jQuery.trim(g[f]);
                    if (e.substring(0, d.length + 1) == (d + "=")) { h = decodeURIComponent(e.substring(d.length + 1));
                        break } } }
            return h } } });
$(document).ajaxSend(function(c, f, b) {
    function a(g) {
        var l = null;
        if (document.cookie && document.cookie !== "") {
            var k = document.cookie.split(";");
            for (var j = 0; j < k.length; j++) {
                var h = jQuery.trim(k[j]);
                if (h.substring(0, g.length + 1) == (g + "=")) { l = decodeURIComponent(h.substring(g.length + 1));
                    break } } }
        return l }

    function e(h) {
        var j = document.location.host;
        var k = document.location.protocol;
        var i = "//" + j;
        var g = k + i;
        return (h == g || h.slice(0, g.length + 1) == g + "/") || (h == i || h.slice(0, i.length + 1) == i + "/") || !(/^(\/\/|http:|https:).*/.test(h)) }

    function d(g) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(g)) } });

function isCookiesEnabled() {
    var a = (navigator.cookieEnabled) ? true : false;
    if (typeof navigator.cookieEnabled == "undefined" && !a) { document.cookie = "test_cookie";
        a = (document.cookie.indexOf("test_cookie") != -1) ? true : false }
    return (a) }
var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
    hasOwn = ({}).hasOwnProperty;
for (var i in { toString: 1 }) { DONT_ENUM = false; }
Object.keys = Object.keys || function(obj) {
    var result = [];
    for (var key in obj)
        if (hasOwn.call(obj, key)) { result.push(key); }
    if (DONT_ENUM && obj) {
        for (var i = 0; key = DONT_ENUM[i++];) {
            if (hasOwn.call(obj, key)) { result.push(key); } } }
    return result; };
Date.prototype.format = function(format) {
    var date = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S+": this.getMilliseconds() };
    if (/(y+)/i.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)); }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length)); } }
    return format; };
(function($, window, document, undefined) {
    if (!window.browser) {
        var userAgent = navigator.userAgent.toLowerCase(),
            uaMatch;
        window.browser = {}

        function isIE() {
            return ("ActiveXObject" in window); }
        if (!uaMatch) { uaMatch = userAgent.match(/chrome\/([\d.]+)/);
            if (uaMatch != null) { window.browser['name'] = 'chrome';
                window.browser['version'] = uaMatch[1]; } }
        if (!uaMatch) { uaMatch = userAgent.match(/firefox\/([\d.]+)/);
            if (uaMatch != null) { window.browser['name'] = 'firefox';
                window.browser['version'] = uaMatch[1]; } }
        if (!uaMatch) { uaMatch = userAgent.match(/opera.([\d.]+)/);
            if (uaMatch != null) { window.browser['name'] = 'opera';
                window.browser['version'] = uaMatch[1]; } }
        if (!uaMatch) { uaMatch = userAgent.match(/safari\/([\d.]+)/);
            if (uaMatch != null) { window.browser['name'] = 'safari';
                window.browser['version'] = uaMatch[1]; } }
        if (!uaMatch) {
            if (userAgent.match(/msie ([\d.]+)/) != null) { uaMatch = userAgent.match(/msie ([\d.]+)/);
                window.browser['name'] = 'ie';
                window.browser['version'] = uaMatch[1]; } else {
                if (isIE() && !!document.attachEvent && (function() { "use strict";
                        return !this; }())) { window.browser['name'] = 'ie';
                    window.browser['version'] = '10'; }
                if (isIE() && !document.attachEvent) { window.browser['name'] = 'ie';
                    window.browser['version'] = '11'; } } }
        if (!$.isIE) { $.extend({ isIE: function() {
                    return (window.browser.name == 'ie'); } }); }
        if (!$.isChrome) { $.extend({ isChrome: function() {
                    return (window.browser.name == 'chrome'); } }); }
        if (!$.isFirefox) { $.extend({ isFirefox: function() {
                    return (window.browser.name == 'firefox'); } }); }
        if (!$.isOpera) { $.extend({ isOpera: function() {
                    return (window.browser.name == 'opera'); } }); }
        if (!$.isSafari) { $.extend({ isSafari: function() {
                    return (window.browser.name == 'safari'); } }); }
    }
})(jQuery, window, document);

function truncate(s, l) {
    if (s.length <= l) {
        return s; }
    return s.substring(0, l) + "..."; }

function copyToClipboard(text) { window.prompt("Copy to clipboard: Ctrl+C, Enter", text); }

function initPopover() {
    $("body").find(":not(div.popover.fade)").click(function() { $('.popover').remove(); });
    var ps = $('[data-toggle="popover"]');
    for (var i = 0; i < ps.length; ++i) {
        var p = ps.eq(i);
        var a = p.attr("data-trigger");
        if (a && a != "") {
            continue; }
        p.attr("data-trigger", "manual");
        p.popover();
        p.on("click", function(e) {
            $(".popover.fade.in").remove()
            var that = $(this)
            that.popover("show");
            e.preventDefault();
            return false;
        });
    }
}

function htmlEncode(value) {
    return $('<div/>').text(value).html(); }

function urlEncode(str) {
    str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}
$(function(){
  //兼容ie
  if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.includes called on null or undefined');
      }

      var O = Object(this);
      var len = parseInt(O.length,10) || 0;
      if (len === 0) {
        return false;
      }
      var n = parseInt(arguments[1],10) || 0;
      var k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {k = 0;}
      }
      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement ||
           (searchElement !== searchElement && currentElement !== currentElement)) {
          return true;
        }
        k++;
      }
      return false;
    };
  }
})
    