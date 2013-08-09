var tns_already, tnscm_adn = [];

(function (window, document) {
    "use strict";
    /** @const */
    var mask = /cmeter_an\.js(#(.+))?/,
        networks = {
            add: function (item) {
                window.tnscm_adn = window.tnscm_adn || [];
                if (indexOf(window.tnscm_adn, item) < 0) {
                    window.tnscm_adn.push(item);
                }
            }
        };

    function each(array, cb) {
        var i, len = array.length;
        if (Array.prototype.forEach !== undefined) {
            Array.prototype.forEach.call(array, cb);
        } else {
            for (i = 0; i < len; ++i) {
                cb(array[i], i, array);
            }
        }
    }

    function onready(cb) {
        function done() {
            each(onready.funcs, function (cb) {
                cb();
            });
            delete onready.funcs;
        }

        function onreadystatechanged() {
            if ("loading" !== document.readyState) {
                done();
                document.detachEvent("onreadystatechange", onreadystatechanged);
            }
        }

        if ("loading" !== document.readyState) {
            cb();
            return;
        }
        if (onready.funcs) {
            onready.funcs.push(cb);
        } else {
            onready.funcs = [cb];
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", done, false);
                return;
            }
            if (document.attachEvent) {
                document.attachEvent("onreadystatechange", onreadystatechanged);
            }
        }
    }

    function parseParams(source) {
        var hash = {};
        each(source.split("&"), function (param) {
            var p = param.split("=");
            hash[p[0]] = p[1];
        });
        return hash;
    }

    function domIterate(node, cb) {
        var nodes = node.childNodes,
            i = nodes.length,
            ret;

        while (i--) {
            ret = domIterate(nodes[i], cb);
            if (ret) { return ret; }
        }
        return cb(node);
    }

    function indexOf(arr, elem) {
        var i, l = arr.length;
        if (Array.prototype.indexOf !== undefined) {
            return Array.prototype.indexOf.call(arr, elem);
        }
        for (i = 0; i < l; i++) {
            if (arr[i] === elem) { return i; }
        }
        return -1;
    }

    function trim(str) {
        if (String.prototype.trim !== undefined) {
            return String.prototype.trim.call(str);
        }
        return str.replace(/^\s+|\s+$/g, '');
    }

    each(document.getElementsByTagName("script"), function (script) {
        var src = script.getAttribute("src"), p, params;
        if (mask.test(src)) {
            p = mask.exec(src)[2];
            if (!p) { return; }

            params = parseParams(p);
            if (params.tnscm_adn) {
                onready(function () {
                    var found = (indexOf(window.tnscm_adn, "inline_cm") >= 0) || domIterate(document, function (node) {
                        if (8 === node.nodeType && "MMI CMeter" === trim(node.nodeValue)) {
                            return true;
                        }
                    });
                    if (found) {
                        networks.add("inline_cm");
                    }
                    networks.add(params.tnscm_adn);
                });
            }
        }
    });

    onready(function () {
        if (tns_already) {
            return;
        }
        tns_already = 1;

        var s = document.createElement("script"),
            p = document.getElementsByTagName("script"),
            l = p.length;

        s.async = true;
        s.type = "text/javascript";
        s.src = location.protocol + "//source.mmi.bemobile.ua/cm/cm.js";

        p[l - 1].parentNode.insertBefore(s, p[l - 1].nextSibling);
    });
}(window, document));

