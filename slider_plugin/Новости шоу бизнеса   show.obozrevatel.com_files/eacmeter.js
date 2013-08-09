(function () {
    var p = admixerSm.eacmeter;
    var asm = admixerSm;

    p.init = function () {
        if (p.isInit)
            return;
        p.isInit = true;
        while (p.initCallbacks.length > 0) {
            p.initCallbacks.pop()(p);
        }
    }
    p.performAudit = function (respObj) {
        try {
            var site = null;
            if (respObj.slots)
                site = respObj.slots[0].zone.site;
            else
                site = respObj;

            var ss = document.createElement("script"),
            ps = document.getElementsByTagName("script"),
            ls = ps.length;
            ss.async = true;
            ss.type = "text/javascript";
            ss.src = location.protocol + "//source.mmi.bemobile.ua/cm/cmeter_an.js#tnscm_adn=admixer";
            ps[ls - 1].parentNode.insertBefore(ss, ps[ls - 1].nextSibling);
        }
        catch (e) { }
    }
    p.init();
})();