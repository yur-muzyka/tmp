(function () {
    var p = admixerSm.easoloway;
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
        var loc = respObj.geo;
        if (loc && loc.country)
        {
            if (loc.country.toLowerCase().indexOf('ru') == 0)
            {
                var cookie_string = document.cookie;
                var cookie_array = cookie_string.split("; ");
                var hasAdmSyncCookie = false;
                var d = new Date().getDay();
                for (var i = 0; i < cookie_array.length; ++i) {
                    var single_cookie = cookie_array[i].split("=");
                    if (single_cookie.length != 2)
                        continue;
                    var name = unescape(single_cookie[0]);
                    
                    if (name.toLocaleLowerCase().indexOf('slwadmixersync') == 0)
                    {
                        var value = parseInt(unescape(single_cookie[1]));
                        if (value == d) {

                            hasAdmSyncCookie = true;
                            break;
                        }
                        
                    }
                }
                if (!hasAdmSyncCookie) {

                    var admGuid = respObj.admguid;
                    if (admGuid) {
                        if (admGuid.indexOf('y') > 0)
                            admGuid = admGuid.split('y')[0];
                        var u = 'http://ssp.adriver.ru/cgi-bin/sync.cgi?ssp_id=7&external_id=' + admGuid;
                        p.asm.sendPixel(u);

                        var expiration_date = new Date();
                        expiration_date.setHours(expiration_date.getHours() + 24);
                        expiration_date = expiration_date.toGMTString();
                        var cookie_string = escape('slwadmixersync') + "=" + escape(d) + "; expires=" + expiration_date;
                        document.cookie = cookie_string;

                    }
                }
            }
        }
    }
    p.init();
})();