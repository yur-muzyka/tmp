(function () {
    if (!window.admixerSm) {
        var w = window, d = document;
        w.admixZArr = (w.admixZArr || []);
        w.admixerSm = { version: '1' };
        var asm = w.admixerSm;
        asm.isStarted = false;
        asm.pageLoadState = 0;
        asm.isStartRequestSend = 0;
        asm.loadingSlotsCnt = 0;
        asm.pageSlots = [];
        asm.doNextRequest = false;
        asm.frmTraf = null;
        asm.stv = 1;
        asm.isExtAuditCalled = false;
        asm.awaitingSlots = [];
        asm.dc = null;



        asm.coreVersion = 4.4;
        asm.scannerVersion = 1.7;
        asm.hostWindow = w;
        var hasFloatingVideo = false;
        asm.enableOnScroll = false;
        asm.options = (w.admixerSmOptions || {});
        asm.cdnPath = (asm.options.cdnPath || 'http://cdn.admixer.net');
        asm.invPath = (asm.options.invPath || 'http://ad.admixer.net');
        asm.mirrorPath = (asm.options.mirrorPath || 'http://ua.cdn.admixer.net');
        asm.options.disableMirror = false;
        if (typeof (asm.options.isScannerEnabled) == 'undefined')
            asm.options.isScannerEnabled = true;
        if (typeof (asm.options.showAdsOnLoad) == 'undefined')
            asm.options.showAdsOnLoad = true;
        asm.teasers_allTeasersPage = 'http://market.admixer.net/ads';
        asm.teasers_allTeasersLabel = 'Все объявления';
        asm.teasers_publicSiteUrl = 'http://market.admixer.net';
        asm.teasers_publicSiteName = 'market.admixer.net';
        asm.teasers_hideAll = (asm.options.teasersHideAllAds || false);

        asm.loadScript = function (url, callback) {
            var s = document.createElement('script');
            s.async = true;
            s.type = 'text/javascript';
            s.src = url;
            if (callback) {
                s.onreadystatechange = s.onload = function () {
                    var state = s.readyState;
                    if (!callback.done && (!state || /loaded|complete/.test(state))) {
                        callback.done = true;
                        callback();
                    }
                };
            }
            var node = document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(s, node);
        }

        asm.ensurePlugin = function (pluginName, callback, version) {
            var p = w.admixerSm[pluginName];
            if (!p) {
                p = asm[pluginName] = {};
                p.asm = asm;
                p.w = w;
                p.initCallbacks = [callback];
                if (!version)
                    version = asm.version;
                asm.loadScript(w.admixerSm.cdnPath + '/scriptlib/' + pluginName.toLocaleLowerCase() + '.js?v=' + version);
            }
            else if (!p.isInit) {
                p.initCallbacks.push(callback);
            }
            else {
                callback(p);
            }
        }

        var getFlashVersion = function () {
            if (window.ActiveXObject) {
                var control = null;
                try {
                    control = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                }
                catch (e) {
                }
                if (control) {
                    version = control.GetVariable('$version').substring(4);
                    version = version.split(',');
                    version = parseFloat(version[0] + '.' + version[1]);
                    delete control;
                    return version;
                }
            }
            else if (typeof navigator.plugins['Shockwave Flash'] !== 'undefined') {
                var words = navigator.plugins['Shockwave Flash'].description.split(' ');
                var aword;
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i])))
                        continue;
                    aword = words[i];
                }
                return aword;
            }
            return 0;
        }

        asm.proceedSlots = function () {
            if (asm.pageLoadState == 1 || !asm.options.showAdsOnLoad) {
                if (asm.loadingSlotsCnt && asm.loadingSlotsCnt > 0) {
                    asm.doNextRequest = true;
                    return;
                }
                var strZns = new Array();
                var tZns = new Array();
                if (!w.admixZArr)
                    return;
                for (var i = 0; i < w.admixZArr.length; i++) {
                    var slotDef = w.admixZArr[i];
                    var ph = document.getElementById(slotDef.ph);
                    if (!slotDef.z || ph == null)
                        continue;
                    var slot = ph.admixSlot;
                    if (!slot) {
                        slot = {};
                        slot.phId = slotDef.ph;
                        slot.index = asm.pageSlots.length;
                        asm.pageSlots.push(slot);
                        ph.admixSlot = slot;
                    }
                    slot.z = (slotDef.z || slot.z);
                    slot.maxItemsCount = (slotDef.maxItemsCount || slot.maxItemsCount || 0);
                    slot.item = (slotDef.item || null);
                    slot.ts = slotDef.ts;
                    slot.labels = (slotDef.labels || null);
                    slot.md = (slotDef.md || null);
                    slot.autoFill = true;
                    if (typeof (slotDef.autoFill) != 'undefined')
                        slot.autoFill = slotDef.autoFill;
                    slot.loadCallback = (slotDef.loadCallback || slot.loadCallback || null);
                    slot.renderedCallback = (slotDef.renderedCallback || slot.renderedCallback || null);
                    slot.prerollBackFunc = (slotDef.prerollBackFunc || slot.prerollBackFunc || null);
                    slot.renderTemplate = (slotDef.renderTemplate || slotDef.renderTemplate || null);
                    if (!slot.autoFill) {
                        slot.loadState = 1;
                        continue;
                    }
                    if (slot.loadState && slot.loadState > 0) {
                        continue;
                    }
                    slot.loadState = 1;
                    asm.loadingSlotsCnt++;
                    var s = slot.z + '|' + slot.phId + '|' + slot.index;
                    slot.item && (s += '|' + slot.item);
                    if (slot.maxItemsCount)
                        s += '|mic' + slot.maxItemsCount;
                    if (slot.labels)
                        s += '|labels' + slot.labels.replace(new RegExp(",", "gm"), "^");
                    if (slot.md)
                        s += '|md' + slot.md;
                    strZns.push(s);
                    tZns.push('zoneIds=' + slot.z);

                }
                if (strZns.length == 0)
                    return;
                var iu = asm.invPath + '/getresponse.js?issp=1&ce=1&libver=' + asm.coreVersion;
                if (!asm.isFrmTrafSupp)
                    iu += '&art=admsm';
                else
                    iu += '&lse=1';

                w.admixerpvId || (w.admixerpvId = new Date().getTime());
                iu += '&pvId=' + w.admixerpvId;
                iu += '&zones=' + strZns.join(',');
                var isDa = (w.self == w.parent);
                iu += '&isda=' + (isDa ? '1' : '0');
                iu += '&fv=' + getFlashVersion();
                if (asm.options.showOnlyTeasers) {
                    iu += '&to=1&sespv=0';
                    d.referrer && (iu += "&ref=" + asm.encodeUrl(d.referrer));
                }
                else {
                    iu += '&pg=' + asm.encodeUrl(w.location.href);
                    d.referrer && (iu += "&ref=" + asm.encodeUrl(d.referrer));
                }
                if (asm.dc) {
                    iu += '&dc=' + asm.dc.darksString + '&srt=' + asm.dc.runtime;
                }
                if (asm.isFrmTrafSupp) {
                    var data = { evType: 'admix_getads', callUrl: iu };
                    asm.frmTraf.contentWindow.postMessage(JSON.stringify(data), '*');
                }
                else {
                    asm.loadScript(iu);
                }
            }
        }
        asm.refreshSlot = function (slot) {
            var strZns = [];
            var izs = slot.z + '|' + slot.ph.id + '|' + slot.index;
            if (slot.maxItemsCount)
                izs += '|mic' + slot.maxItemsCount;
            strZns.push(izs);
            var iu = asm.invPath + '/getresponse.js?issp=1&ce=1&libver=' + asm.coreVersion;
            if (!asm.isFrmTrafSupp)
                iu += '&art=admsm';
            else
                iu += '&lse=1';
            w.admixerpvId || (w.admixerpvId = new Date().getTime());
            iu += '&pvId=' + w.admixerpvId;
            iu += '&zones=' + strZns.join(',');
            iu += '&fv=' + getFlashVersion();

            var isDa = (w.self == w.parent);
            iu += '&isda=' + (isDa ? '1' : '0');
            if (isDa) {
                iu += '&pg=' + asm.encodeUrl(w.location.href);
                d.referrer && (iu += "&ref=" + asm.encodeUrl(d.referrer));
            }
            if (asm.dc) {
                iu += '&dc=' + asm.dc.darksString + '&srt=' + asm.dc.runtime;
            }
            slot.loadState = 1;
            if (asm.isFrmTrafSupp) {
                var data = { evType: 'admix_getads', callUrl: iu };
                asm.frmTraf.contentWindow.postMessage(JSON.stringify(data), '*');
            }
            else {
                asm.loadScript(iu);
            }
        }

        asm.processSinglePageResponse = function (respObj) {
            var slotsData = respObj.slots;

            var slots = [];
            for (var i = 0; i < slotsData.length; i++) {
                var slotData = slotsData[i];
                slotData.admguid = respObj.admguid;
                var ph = d.getElementById(slotData.phId);
                if (!ph)
                    continue;
                var slot = ph.admixSlot;
                if (!slot || slot.loadState != 1)
                    continue;

                slot.ph = ph;
                slot.loadState = 2;
                slot.data = slotData;
                slots.push(slot);
                if (slot.data.items && slotData.items.length > 0) {
                    if (slot.data.items[0].cr.adType == 6)
                        hasFloatingVideo = true;
                }
            }
            admixerSm.loadingSlotsCnt = 0;
            if (asm.doNextRequest) {
                asm.doNextRequest = false;
                setTimeout(function () { admixerSm.proceedSlots(); }, 1);
            }
            for (var i = 0; i < slots.length; i++) {
                var slot = slots[i];
                var slotData = slot.data;
                try {
                    if (slotData.items && slotData.items.length > 0) {
                        if (!asm.enableOnScroll || !slotData.items[0].lOnScroll || slotData.items[0].cr.adType == 5) {
                            if (slotData.items[0].cr.adType == 5 && hasFloatingVideo)
                                continue;
                            asm.fillSlot(slot, slotData);
                            continue;
                        }
                        if (asm.isPhVisible(slot.ph, slotData.zHeight)) {

                            asm.fillSlot(slot, slotData);
                            continue;
                        }
                        asm.awaitingSlots.push(slot);
                        if (!asm.isOnWScrollReged) {
                            asm.isOnWScrollReged = true;
                            if (w.attachEvent) {
                                w.attachEvent("onscroll", asm.onWScroll);
                            }
                            else if (w.addEventListener) {
                                w.addEventListener("scroll", asm.onWScroll, false);
                            }
                        }
                    } else {
                        slot.loadState = 3;
                        if (slot.loadCallback) {
                            try {
                                slot.loadCallback(slotData);
                            }
                            catch (e2) { }
                        }
                    }
                }
                catch (e) {
                    //log error
                }
            }
            if (!asm.isExtAuditCalled) {
                asm.isExtAuditCalled = true;
                if (respObj.slots.length > 0 && respObj.slots[0] && respObj.slots[0].zone && respObj.slots[0].zone.site && respObj.slots[0].zone.site.audSystems && respObj.slots[0].zone.site.audSystems.length) {
                    var site = respObj.slots[0].zone.site;
                    var auds = respObj.slots[0].zone.site.audSystems;
                    for (var i = 0; i < auds.length; i++) {
                        asm.ensurePlugin("ea" + auds[i], function (p) {
                            p.performAudit(respObj);
                        });
                    }
                }
            }
        }

        asm.isPhVisible = function (element, eHeight) {
            var docViewTop = (w.pageYOffset || (d.documentElement && d.documentElement.scrollTop) || d.body.scrollTop); //$(window).scrollTop();
            var docViewBottom = docViewTop + (w.innerHeight || (d.documentElement && d.documentElement.clientHeight) || (d.body && d.body.clientHeight));
            var elemTop = 0;
            var op = element;
            while (op != null) {

                if (!isNaN(parseInt(op.offsetTop))) {
                    elemTop += parseInt(op.offsetTop);
                }
                op = op.offsetParent;
            }

            var elemBottom = elemTop + eHeight;
            var isInViewPort = ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
            return isInViewPort;
        }

        asm.onWScroll = function () {
            if (asm.awaitingSlots && asm.awaitingSlots.length > 0) {
                for (var i = 0; i < asm.awaitingSlots.length; i++) {
                    if (asm.awaitingSlots[i] == null)
                        continue;
                    var slot = asm.awaitingSlots[i];
                    if (slot.loadState != 2)
                        continue;
                    if (asm.isPhVisible(slot.ph, slot.data.zHeight)) {
                        asm.fillSlot(slot, slot.data);
                        asm.awaitingSlots[i] = null;
                    }
                }
            }
        }

        asm.fillSlot = function (slot, slotData, rCallback) {
            setTimeout(function () {
                try {
                    for (var i = 0; i < slotData.items.length; i++) {
                        var bn = slotData.items[i];
                        bn.root = slotData;
                        if (!bn.isCustomGaTrackingEnabled) {
                            var utmSrc = 'media';
                            if (slotData.iType == 2)
                                utmSrc = 'market';
                            var gat = 'utm_source=admixer&utm_medium=' + utmSrc + '&utm_campaign=' + bn.id + '&utm_content=' + slotData.requestId;
                            if (bn.trackingUrl.indexOf('?') > 0)
                                bn.trackingUrl += '&' + gat;
                            else
                                bn.trackingUrl += '?' + gat;
                        }
                        bn.zId = slotData.zId;

                        if (bn.enableOobCt) {
                            if (bn.showDirectRefs) {
                                bn.trackingUrl = bn.trackingUrl.replace('[TIMESTAMP]', new Date().getTime());
                                bn.redirectUrl = bn.trackingUrl;
                            }
                            else {
                                bn.redirectUrl = asm.cdnPath + '/scriptlib/click.html?retUrl=' + asm.encodeUrl(bn.trackingUrl);
                            }

                        }
                        else
                        {
                            bn.redirectUrl = asm.invPath + '/click.aspx?item=' + bn.id + '&requestId=' + slotData.requestId + '&zone=' + bn.zId + '&admguid=' + slotData.admguid;
                        }
                    }
                    if (slot.loadCallback) {
                        try {
                            slot.loadCallback(slotData);
                        }
                        catch (e2) { }
                        if (slotData.customRender) {
                            slot.loadState = 3;
                            return;
                        }
                    }
                    //media ads
                    if (slotData.iType <= 1) {
                        asm.ensurePlugin('mediaads2', function (p) {
                            p.fillSlot(slot, slotData, asm.onSlotRendered);
                        });
                    }
                    else if (slotData.iType == 2) {
                        asm.ensurePlugin('teasers', function (p) {
                            p.fillSlot(slot, slotData, asm.onSlotRendered);
                        });
                    }
                    else {
                        //Define other media types
                    }
                }
                catch (e) {
                }
            }, 1);
        }

        asm.encodeUrl = function (u) {
            if (w.encodeURIComponent)
                return w.encodeURIComponent(u);
            else
                return escape(u);
        }

        asm.sendPixel = function (u) {
            var a_zp = document.createElement('IFRAME');
            u = u.replace('[TIMESTAMP]', new Date().getTime());
            a_zp.src = u;
            a_zp.width = 1;
            a_zp.height = 1;
            a_zp.style.width = '1px';
            a_zp.style.height = '1px';
            a_zp.style.position = 'absolute';
            a_zp.style.top = '-10000px';
            a_zp.style.left = '0px';
            document.body.appendChild(a_zp);
        }

        asm.sendFlasfPixel = function (u) {
            asm.sendPixel(u);
        }

        asm.trackView = function (bn, rid, vt) {
            if (!vt)
                vt = 1;
            var u = asm.invPath + '/view.aspx?item=' + bn.id + '&requestId=' + rid + '&zone=' + bn.zId + '&pvvt=' + vt;
            if (vt != 2)
                asm.sendPixel(u);
            else
                asm.sendFlasfPixel(u);
        }

        asm.sendPixels = function (ph, bn, rid, vt) {
            asm.trackView(bn, rid, vt);
            if (bn.cr.i_zps && bn.cr.i_zps.length > 0) {
                var zps = bn.cr.i_zps.split(' ');
                for (i = 0; i < zps.length; i++) {
                    if (vt != 2)
                        asm.sendPixel(zps[i]);
                    else
                        asm.sendFlasfPixel(zps[i]);
                }
            }
            else if (bn.cr.zeroPixel && bn.cr.zeroPixel != 'http://') {
                if (vt != 2)
                    asm.sendPixel(bn.cr.zeroPixel);
                else
                    asm.sendFlasfPixel(bn.cr.zeroPixel);
            }
        }

        asm.trackClick = function (href, wnd) {
            wnd = (wnd || asm.hostWindow);
            var prms = href.split('?')[1].split('&');
            var phId = '';
            var itemId = '';
            for (var i = 0; i < prms.length; i++) {
                var pair = prms[i].split('=');
                var key = pair[0].toLocaleLowerCase();
                if (key == 'phid')
                    phId = pair[1];
                else if (key == 'item')
                    itemId = pair[1];
                if (itemId && phId)
                    break;
            }
            var ph = null;
            var slot = null;
            var bn = null;
            if (phId)
                ph = wnd.document.getElementById(phId);
            if (ph) {
                slot = ph.admixSlot;
                if (slot) {
                    for (var i = 0; i < slot.data.items.length; i++) {
                        if (slot.data.items[i].id == itemId) {
                            bn = slot.data.items[i];
                            break;
                        }
                    }
                }
            }
            if (!bn) {
                try{
                    for (var i = 0; i < w.admixZArr.length; i++) {
                        var slotDef = w.admixZArr[i];
                        var cPh = document.getElementById(slotDef.ph);
                        if (!cPh)
                            continue;
                        var cSlot = cPh.admixSlot;
                        if (!cSlot || !cSlot.data || !cSlot.data.items || !cSlot.data.items.length)
                            continue;
                        for (var j = 0; j < cSlot.data.items.length; j++) {
                            var cItem = cSlot.data.items[i];
                            if (cItem.redirectUrl == href) {
                                bn = cItem;
                                slot = cSlot;
                                ph = cPh;
                                break;
                            }
                        }
                    }}
                catch (ee)
                {
                }
            }

            if (bn && bn.cr && bn.enableOobCt) {
                if (asm.frmTraf) {
                    var data = { evType: 'admix_logClick' };
                    data.callUrl = asm.invPath + '/logclick.aspx?lse=1&item=' + bn.id + '&requestId=' + bn.root.requestId + '&zone=' + bn.zId + '&admguid=' + bn.root.admguid;
                    asm.frmTraf.contentWindow.postMessage(JSON.stringify(data), '*');
                }
                else {
                    asm.sendPixel(asm.invPath + '/logclick.aspx?lse=1&item=' + bn.id + '&requestId=' + bn.root.requestId + '&zone=' + bn.zId + '&admguid=' + bn.root.admguid);
                }
                if (bn.cr.i_cus) {
                    var iurls = bn.cr.i_cus.split(' ');
                    for (var i = 0; i < iurls.length; i++) {
                        var u = iurls[i];
                        asm.sendPixel(u);
                    }
                }
            }
            asm.callExt('onAdClicked', slot, bn, null);
            if (asm.options.clickTrackingPixelUrl || asm.hostWindow.clickTrackingLink) {
                asm.sendPixel((asm.options.clickTrackingPixelUrl || asm.hostWindow.clickTrackingLink));
            }
            return true;
        }

        asm.onBannerRendered = function (wnd, phIdOrObj, bn, opts) {
            if (null == wnd)
                wnd = window;
            var slot = null;
            var ph = phIdOrObj;
            if (!ph.tagName)
                ph = wnd.document.getElementById(phIdOrObj);
            if (ph)
                slot = ph.admixSlot;
            asm.callExt('onAdRendered', slot, ph, opts);
            if (slot && slot.renderedCallback) {
                slot.renderedCallback(slot);
            }
        }

        asm.callExt = function (fName, slot, bn, opts) {
            if (!asm.options.extInterfaces || !asm.options.extInterfaces.length)
                return;
            for (var i = 0; i < asm.options.extInterfaces.length; i++) {
                var extIf = asm.options.extInterfaces[i];
                if (!extIf[fName])
                    continue;
                try {
                    extIf[fName](slot, bn, opts);
                }
                catch (e) { }
            }
        }

        asm.onSlotRendered = function () {

        }

        asm.handleWindowRequest = function (event) {
            var data = null;
            try {
                data = JSON.parse(event.data);
            }
            catch (e) {
            }
            if (null == data)
                return;
            if (data.evType == 'admix_loaded') {
                asm.isFrmTrafSupp = true;
                asm.isReady = true;
                asm.start2();
            }
            else if (data.evType == 'admix_onadresponse') {
                asm.processSinglePageResponse(data.adResponse);
            }
        }

        asm.start = function () {
            asm.start2();
        }

        asm.onPageLoad2 = function () {
            if (asm.pageLoadState)
                return;
            asm.pageLoadState = 1;
            if (!asm.wasScannerInvoked) {
                asm.wasScannerInvoked = true;
                if (asm.options.isScannerEnabled)
                    asm.dc = asm.adScanner.GetPageCategories();
            }
            if (asm.isReady)
                asm.start2();
        }

        asm.onPageLoad = function () {
            asm.onPageLoad2();
        }

        asm.start2 = function () {
            if (asm.isReady && !asm.wasStarted) {
                if (asm.pageLoadState || !asm.options.showAdsOnLoad) {
                    asm.wasStarted = true;
                    if (!asm.wasScannerInvoked) {
                        asm.wasScannerInvoked = true;
                        if (asm.options.isScannerEnabled)
                            asm.dc = asm.adScanner.GetPageCategories();
                    }
                    asm.proceedSlots();
                }
                if (!asm.isReadyCbInvoked && asm.options.onLibReady) {
                    asm.isReadyCbInvoked = true;
                    asm.options.onLibReady();
                }
            }
        }

        asm.isAutouUpdCalled = false;
        admixerSm.onAutoUpdate = function () {
            if (asm.isAutouUpdCalled)
                return;
            if (window.XMLHttpRequest && w.localStorage && w.postMessage) {
                if (window.addEventListener) {
                    window.addEventListener("message", admixerSm.handleWindowRequest, true);
                } else if (window.attachEvent) {
                    window.attachEvent("onmessage", admixerSm.handleWindowRequest);
                }

                var frm = document.createElement('IFRAME');
                frm.style.position = 'absolute';
                frm.style.width = '0px';
                frm.style.height = '0px';
                frm.style.top = '-10000px';
                frm.src = asm.invPath + '/frmtraf.html?ts=' + asm.coreVersion + '&orig=' + window.location.protocol + "//" + window.location.hostname;
                asm.frmTraf = frm;
                if (document.body)
                    document.body.appendChild(frm);
                else {
                    if (document.getElementsByTagName('script').length > 0) {
                        var node = document.getElementsByTagName('script')[0];
                        node.parentNode.insertBefore(frm, node);
                    }
                }


                setTimeout(admixerSm.onFrmTraffCb, 500);
            }
            else {
                asm.isReady = true;
                asm.start2();
            }
        }

        admixerSm.onFrmTraffCb = function () {
            if (asm.isFrmTrafSupp)
                return;
            asm.isReady = true;
            asm.start2();
        }


        //PLUGINS START

        //start plugin json
        if (typeof JSON !== 'object') {
            JSON = {};
        }
        (function () {
            'use strict';
            function f(n) {
                return n < 10 ? '0' + n : n;
            }
            if (typeof Date.prototype.toJSON !== 'function') {
                Date.prototype.toJSON = function (key) {
                    return isFinite(this.valueOf())
                        ? this.getUTCFullYear() + '-' +
                            f(this.getUTCMonth() + 1) + '-' +
                            f(this.getUTCDate()) + 'T' +
                            f(this.getUTCHours()) + ':' +
                            f(this.getUTCMinutes()) + ':' +
                            f(this.getUTCSeconds()) + 'Z'
                        : null;
                };
                String.prototype.toJSON =
                    Number.prototype.toJSON =
                    Boolean.prototype.toJSON = function (key) {
                        return this.valueOf();
                    };
            }

            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                gap,
                indent,
                meta = {    // table of character substitutions
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '"': '\\"',
                    '\\': '\\\\'
                },
                rep;
            function quote(string) {
                escapable.lastIndex = 0;
                return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                    var c = meta[a];
                    return typeof c === 'string'
                        ? c
                        : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' : '"' + string + '"';
            }


            function str(key, holder) {
                var i,          // The loop counter.
                    k,          // The member key.
                    v,          // The member value.
                    length,
                    mind = gap,
                    partial,
                    value = holder[key];
                if (value && typeof value === 'object' &&
                        typeof value.toJSON === 'function') {
                    value = value.toJSON(key);
                }
                if (typeof rep === 'function') {
                    value = rep.call(holder, key, value);
                }
                switch (typeof value) {
                    case 'string':
                        return quote(value);
                    case 'number':
                        return isFinite(value) ? String(value) : 'null';
                    case 'boolean':
                    case 'null':
                        return String(value);
                    case 'object':
                        if (!value) {
                            return 'null';
                        }
                        gap += indent;
                        partial = [];
                        if (Object.prototype.toString.apply(value) === '[object Array]') {
                            length = value.length;
                            for (i = 0; i < length; i += 1) {
                                partial[i] = str(i, value) || 'null';
                            }
                            v = partial.length === 0
                                ? '[]'
                                : gap
                                ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                                : '[' + partial.join(',') + ']';
                            gap = mind;
                            return v;
                        }
                        if (rep && typeof rep === 'object') {
                            length = rep.length;
                            for (i = 0; i < length; i += 1) {
                                if (typeof rep[i] === 'string') {
                                    k = rep[i];
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        } else {
                            for (k in value) {
                                if (Object.prototype.hasOwnProperty.call(value, k)) {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        }
                        v = partial.length === 0
                            ? '{}'
                            : gap
                            ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                            : '{' + partial.join(',') + '}';
                        gap = mind;
                        return v;
                }
            }
            if (typeof JSON.stringify !== 'function') {
                JSON.stringify = function (value, replacer, space) {
                    var i;
                    gap = '';
                    indent = '';
                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }
                    } else if (typeof space === 'string') {
                        indent = space;
                    }
                    rep = replacer;
                    if (replacer && typeof replacer !== 'function' &&
                            (typeof replacer !== 'object' ||
                            typeof replacer.length !== 'number')) {
                        throw new Error('JSON.stringify');
                    }
                    return str('', { '': value });
                };
            }
            if (typeof JSON.parse !== 'function') {
                JSON.parse = function (text, reviver) {
                    var j;
                    function walk(holder, key) {
                        var k, v, value = holder[key];
                        if (value && typeof value === 'object') {
                            for (k in value) {
                                if (Object.prototype.hasOwnProperty.call(value, k)) {
                                    v = walk(value, k);
                                    if (v !== undefined) {
                                        value[k] = v;
                                    } else {
                                        delete value[k];
                                    }
                                }
                            }
                        }
                        return reviver.call(holder, key, value);
                    }

                    text = String(text);
                    cx.lastIndex = 0;
                    if (cx.test(text)) {
                        text = text.replace(cx, function (a) {
                            return '\\u' +
                                ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        });
                    }
                    if (/^[\],:{}\s]*$/
                            .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                        j = eval('(' + text + ')');

                        return typeof reviver === 'function'
                            ? walk({ '': j }, '')
                            : j;
                    }
                    throw new SyntaxError('JSON.parse');
                };
            }
        }());
        //end plugin json

        //start plugin adScaner v 1.6
        (function () {
            var asm = admixerSm;
            var w = window;
            if (!admixerSm.adScanner) {
                admixerSm.adScanner = {};
                admixerSm.adScanner.initCallbacks = [];

            }
            var p = admixerSm.adScanner;
            p.asm = asm;
            p.init = function () {
                if (p.isInit)
                    return;
                p.isInit = true;
                while (p.initCallbacks.length > 0) {
                    p.initCallbacks.pop()(p);
                }
            }


            var categories = { "257": [{ "rl": 30, "wrd": ["авто"], "ir": [{ "wrd": ["диск"], "ir": [] }, { "wrd": ["тюн"], "ir": [] }, { "wrd": ["кресл"], "ir": [] }, { "wrd": ["крісл"], "ir": [] }, { "wrd": ["магазин"], "ir": [] }, { "wrd": ["покрышк"], "ir": [] }, { "wrd": ["покришк"], "ir": [] }, { "wrd": ["сигнализаци"], "ir": [] }, { "wrd": ["сигналізац"], "ir": [] }, { "wrd": ["скло"], "ir": [] }, { "wrd": ["стекл"], "ir": [] }, { "wrd": ["гум"], "ir": [] }, { "wrd": ["резин"], "ir": [] }, { "wrd": ["колод"], "ir": [] }, { "wrd": ["чехол"], "ir": [] }, { "wrd": ["чохол"], "ir": [] }, { "wrd": ["фильтр"], "ir": [] }, { "wrd": ["фільтр"], "ir": [] }, { "wrd": ["свеч"], "ir": [] }, { "wrd": ["свіч"], "ir": [] }, { "ir": [], "wrd": ["товар", "кондиц", "рын", "рин", "запчас", "инстр", "аккумулят", "масл", "хими", "хімі", "космет", "аккуст", "сигнал", "акумулят", "акуст", "серв", "предохранит", "сабвуф", "магнитол", "магнітол", "dvd"] }] }, { "rl": 30, "wrd": ["колод"], "ir": [{ "wrd": ["гальмівн"], "ir": [] }, { "wrd": ["тормозн"], "ir": [] }] }, { "rl": 30, "wrd": ["резин", "гум"], "ir": [{ "wrd": ["летн", "всесез", "літн"], "ir": [{ "ir": [], "wrd": ["шин", "покр"] }] }, { "wrd": ["зимн"], "ir": [{ "ir": [], "wrd": ["шин", "покр"] }] }, { "wrd": ["купит"], "ir": [{ "ir": [], "wrd": ["шин", "покр"] }] }, { "ir": [], "wrd": ["ковр", "килим"] }] }, { "rl": 30, "wrd": ["диск"], "ir": [{ "wrd": ["лит", "штамп"], "ir": [] }, { "wrd": ["легкосплав"], "ir": [] }, { "ir": [], "wrd": ["колпак"] }, { "ir": [], "wrd": ["тормоз"] }, { "ir": [], "wrd": ["шин"] }] }, { "rl": 30, "wrd": ["фильтр", "фільтр"], "ir": [{ "wrd": ["воздуш"], "ir": [] }, { "wrd": ["маслян"], "ir": [] }, { "wrd": ["топл"], "ir": [] }, { "wrd": ["палив"], "ir": [] }, { "wrd": ["повітр"], "ir": [] }] }, { "rl": 30, "wrd": ["свеч"], "ir": [{ "wrd": ["зажиг"], "ir": [] }, { "wrd": ["запалюв"], "ir": [] }] }, { "rl": 30, "wrd": ["грм"], "ir": [{ "wrd": ["рем"], "ir": [] }] }, { "rl": 30, "wrd": ["шаров", "кульов"], "ir": [{ "wrd": ["опора"], "ir": [] }] }, { "rl": 30, "wrd": ["стаб"], "ir": [{ "wrd": ["тяг"], "ir": [] }, { "wrd": ["стойк"], "ir": [] }] }, { "rl": 30, "wrd": ["рулев"], "ir": [{ "wrd": ["тяг"], "ir": [] }, { "wrd": ["колес"], "ir": [] }] }, { "rl": 30, "wrd": ["турбонад"], "ir": [{ "ir": [], "wrd": ["карбюрат"] }] }, { "ir": [], "wrd": ["антифриз", "тосол", "брызговик", "ветровик", "парктрон", "фаркоп", "амортизат", "подвеск"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["мотор", "трансмис"] }], "wrd": ["масл"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["охлажд", "охолодж", "тормоз", "гальм", "гур"] }], "wrd": ["жидкост", "рідин"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["ключ"] }], "wrd": ["динамометр", "торцов", "накид", "рожков", "шарнир", "комбин", "зажиг"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["безопас", "двс"] }], "wrd": ["подушк"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["карт"] }], "wrd": ["двер"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["тюнінг", "тюнинг"] }], "wrd": ["запчаст", "аксес"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["мини", "міні"] }], "wrd": ["мойк", "мийк"], "rl": 5 }], "258": [{ "rl": 40, "wrd": ["бухгалтер", "финанс", "фінанс"], "ir": [{ "wrd": ["журнал", "бланк", "обучен", "форум", "курс", "предприят", "програм", "учет", "календар", "1с", "книг", "навчан", "підприєм", "облік", "книж", "стандарт", "полож", "таможен", "календ", "отчёт", "отчет", "звіт", "домашн"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["налог", "наклад"] }], "wrd": ["реквизит"], "rl": 20 }], "259": [{ "rl": 0, "wrd": ["акушерств", "беремен", "вагітн", "невинош", "овуля", "триместр", "гипокс", "гіпокс", "новонародж", "новорожд"], "ir": [] }, { "rl": 20, "wrd": ["базаль"], "ir": [{ "wrd": ["температ"], "ir": [] }] }, { "rl": 30, "wrd": ["рожд", "полог", "зачат"], "ir": [{ "wrd": ["дат", "день", "истори", "календар", "подготов", "підготов", "будин"], "ir": [] }] }, { "rl": 20, "wrd": ["кесарев"], "ir": [{ "wrd": ["сечен", "розтин"], "ir": [] }] }, { "rl": 30, "wrd": ["матер", "рожден", "народж", "родит"], "ir": [{ "wrd": ["ребен", "дитин", "малюк", "мальч", "хлопч", "дівчин", "девоч", "малыш"], "ir": [] }] }], "260": [{ "rl": 30, "wrd": ["дизайн", "интерьер", "інтерєр"], "ir": [{ "wrd": ["квартир", "дом", "комнат", "коттедж", "потол", "кухн", "кухон", "офис", "прихож", "ремонт", "спальн", "ванн", "гостин", "будинк", "кімнат", "стел", "кухн", "офіс", "вітальн", "кондиц", "стол", "стул", "стіл", "кроват", "ліжко"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["мебел", "мебл", "окн", "окон", "вікн", "двер", "ван", "стол", "стул", "стіл"] }], "wrd": ["украш", "реставр", "обнов", "ретуш", "ремонт"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["мягк", "мякі", "дом"] }], "wrd": ["мебел", "мебл"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["светильн", "освещ", "проектор", "освітл", "ламп"] }], "wrd": ["ночн", "нічн"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["потол", "стил", "дизайн", "плафон"] }], "wrd": ["люстр"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["свет", "світ", "стен", "стін", "плафон", "стил"] }], "wrd": ["бра", "светильн"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["печ", "топк", "дым", "дим", "дом", "купит", "стоим", "мрамор", "лектрич", "экран"] }], "wrd": ["камин"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["цвет", "квіт", "декор", "фарфор", "хрустал"] }], "wrd": ["подставк", "ваза"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["стен", "стін", "стол", "стіл", "фасад", "проек"] }], "wrd": ["часы", "годинник"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["фасад", "посуд", "тарел", "подушк", "постел", "постіл"] }], "wrd": ["декор"], "rl": 20 }, { "ir": [], "wrd": ["витраж"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["стил", "дизайн", "декор", "шкур"] }], "wrd": ["ковер", "ковр", "килим"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["стил", "дизайн", "декор", "гирлянд", "римск", "ван", "ламбр", "фото"] }], "wrd": ["штор", "тюль", "занавес"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["купе", "мдф", "дерев", "прихож"] }], "wrd": ["шкаф"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["шуй"] }], "wrd": ["фен", "фэн"], "rl": 3 }], "261": [{ "rl": 40, "wrd": ["питани", "харчув", "завтрак", "обед", "ужин", "снідан", "обід", "вечер"], "ir": [{ "wrd": ["здоров", "правил", "натурал", "орган", "раздел", "рацион", "баланс", "колог", "диетич", "розділ", "раціон", "дієтич", "полезн"], "ir": [] }] }, { "rl": 0, "wrd": ["диет", "похуд", "дієт"], "ir": [] }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["вещ", "речов"] }], "wrd": ["обмен", "обмін"] }], "wrd": ["нормал"], "rl": 40 }, { "ir": [{ "ir": [], "wrd": ["орган"] }], "wrd": ["очищ", "оздоров"], "rl": 20 }], "262": [{ "rl": 50, "wrd": ["аренд", "оренд", "съем", "снят", "знім", "сдав", "сдам", "здам", "здаю", "сдат", "посредн"], "ir": [{ "wrd": ["комнат", "кімнат", "недвиж", "нерухом", "кварт", "дом", "дім", "будинк", "жилищ", "житл", "апартам", "дач", "котедж"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["аренд", "оренд"] }], "wrd": ["риелтор", "ріелтор"], "rl": 60 }], "263": [{ "ir": [{ "ir": [], "wrd": ["новост", "новин"] }], "wrd": ["спорт"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["кубк", "премьер", "уефа", "фифа", "бокс", "олимпийск", "теннис", "биатл", "миксфайт", "футбол", "баскетб", "гандб", "хокей", "хоккей", "волейб", "футзал", "бейсб", "регб", "уєфа", "фіфа", "олімпійск", "теніс", "біатл", "міксфайт", "украин"] }], "wrd": ["чемпион", "кубок", "кубк", "турнир", "чемпіон", "турнір", "сборн", "збірн", "таблиц", "рейтинг"], "rl": 60 }, { "ir": [], "wrd": ["букмекер"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["бокс", "теннис", "биатл", "миксфайт", "футбол", "баскетб", "гандб", "хокей", "хоккей", "волейб", "футзал", "бейсб", "регб", "теніс", "біатл", "міксфайт"] }], "wrd": ["клуб", "трансфер"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["таблиц"] }], "wrd": ["трансфер"], "rl": 20 }], "264": [{ "rl": 20, "wrd": ["ориентир", "туризм", "орієнт", "путешеств", "подорож", "trevel", "маршрут", "мандр"], "ir": [{ "wrd": ["авто", "мото", "auto"], "ir": [] }] }, { "rl": 30, "wrd": ["отдых", "подорож", "відпочин", "путешеств", "развлеч"], "ir": [{ "wrd": ["зимн", "зимов", "семейн", "сімей", "тур", "активн"], "ir": [] }, { "wrd": ["кстрим", "кстрем", "спорт", "адренал"], "ir": [] }, { "wrd": ["воздуш", "повітрян"], "ir": [] }] }, { "rl": 0, "wrd": ["альпиниз", "скалолаз", "велопод", "велопутеш", "велопоход", "виндсерф", "дайвин", "дельтаплан", "кайт", "параплан", "пейнтбол", "страйкбол", "скалолаз", "сноуборд", "спелеолог", "яхт", "гидроцик", "гидрокост", "рафтинг", "треккинг", "сноутюб", "маунтинбайк", "каякин", "геокеш", "скейт", "гольф", "диггер"], "ir": [] }, { "rl": 30, "wrd": ["катан", "прогул", "езда"], "ir": [{ "wrd": ["кон", "лошад", "верхо"], "ir": [] }] }, { "rl": 40, "wrd": ["снаряжен", "споряджен"], "ir": [{ "wrd": ["лыж", "лижн", "борд", "яхт", "турист", "альпин", "дайв"], "ir": [] }] }, { "rl": 30, "wrd": ["палатк"], "ir": [{ "wrd": ["местн", "місн", "турист"], "ir": [] }] }, { "rl": 40, "wrd": ["полет", "політ"], "ir": [{ "ir": [], "wrd": ["воздуш", "планер", "верт", "повітр"] }] }, { "rl": 50, "wrd": ["поход", "похід"], "ir": [{ "wrd": ["крим", "крым", "карпат"], "ir": [] }, { "wrd": ["снаряж", "споряд"], "ir": [] }] }, { "rl": 20, "wrd": ["прыжк", "стриб"], "ir": [{ "wrd": ["параш", "банд"], "ir": [] }] }, { "rl": 30, "wrd": ["тур"], "ir": [{ "wrd": ["поход", "путешеств", "снаряж", "споряд", "похід"], "ir": [] }, { "wrd": ["вело", "подводн", "парус", "вітрил", "воен", "військ", "джип", "фото", "горн", "гірс", "сафари", "лиж", "автомоб", "рюкзак"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["лук", "пневмат"] }], "wrd": ["стрельб", "стрільб"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["горн", "лиж", "лыж", "гірсь"] }], "wrd": ["курорт", "маршрут"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["сумк", "чемодан"] }], "wrd": ["дорожн"], "rl": 20 }], "265": [{ "rl": 40, "wrd": ["вибір", "вибран", "брати", "выбор", "выбра", "вступ", "украин", "україн"], "ir": [{ "wrd": ["школ", "коледж", "инстит", "інститут", "университет", "університет", "професію", "профессию", "училищ", "техникум", "технікум"], "ir": [] }] }, { "rl": 40, "wrd": ["семинар", "лекц", "диплом", "учебник", "контрольн", "реферат", "курсов", "конспект", "доклад", "зно", "олімпіад", "семінар", "підручн", "кзамен", "доповід", "олимпиад"], "ir": [{ "wrd": ["экономик", "хими", "физик", "алгебр", "черчени", "биологи", "геометр", "географ", "математик", "природоведени", "скача", "програм", "економік", "хімі", "фізик", "креслен", "біологі", "тератур", "природознавс", "завантаж"], "ir": [] }] }, { "rl": 0, "wrd": ["абітур", "абитур", "бакалавр", "шпаргалк", "реферат", "факультет", "кафедр", "ранец"], "ir": [] }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["оцен", "оцін", "тест"] }], "wrd": ["незалежн", "независим"] }], "wrd": ["внешн", "зовніш"], "rl": 40 }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["закл", "завед"] }], "wrd": ["учбов", "учеб"] }], "wrd": ["вищ", "высш"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["зно"] }], "wrd": ["тест"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["процес", "оцін", "оцен"] }], "wrd": ["болонск"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["пособ", "підр", "форм", "програм"] }], "wrd": ["навча", "учеб", "школ", "шкіл"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["олимпиад"] }], "wrd": ["студен", "школ"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["универ", "універ", "інстит", "инстит"] }], "wrd": ["ректор"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["кампан"] }], "wrd": ["вступ"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["год", "рік", "заклад", "заведен"] }], "wrd": ["навча", "учеб"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["акредит", "аккредит"] }], "wrd": ["уровен", "рівен"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["школ"] }], "wrd": ["рюкзак"], "rl": 40 }], "266": [{ "rl": 30, "wrd": ["плеер", "плеєр", "проигр", "програв"], "ir": [{ "wrd": ["mp3", "мп3", "аудио", "видео", "blu", "dvd", "vhs", "винил", "вініл"], "ir": [] }] }, { "rl": 30, "wrd": ["акустич"], "ir": [{ "wrd": ["систем", "колонк"], "ir": [] }] }, { "rl": 40, "wrd": ["домашн"], "ir": [{ "wrd": ["кинотеатр"], "ir": [] }] }, { "rl": 100, "wrd": ["купит"], "ir": [{ "wrd": ["айпод", "фотокамер", "видеокамер", "плеер", "ipod", "фотоапар"], "ir": [] }] }, { "rl": 30, "wrd": ["пульт"], "ir": [{ "wrd": ["универс", "дистанц", "універс"], "ir": [] }] }, { "ir": [], "wrd": ["медиацентр", "проектор", "фонокоррект"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["антен", "кабел", "пристав", "кроншт", "усилител", "lcd", "led", "плазм", "smart", "3d"] }], "wrd": ["телевиз"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["пристав", "ресивер"] }], "wrd": ["игров", "цифров", "iptv"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["кабел", "техник", "камер"] }], "wrd": ["аудио", "видео", "фото", "hdmi", "web"], "rl": 30 }], "513": [{ "rl": 40, "wrd": ["авто"], "ir": [{ "wrd": ["легков", "рынок", "сайт", "базар", "салон", "прокат", "реализац", "ринок", "реалізац", "седан", "купе", "комби", "покуп", "купит", "цена", "цены", "цено"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["купит", "продат", "цен", "обзор"] }], "wrd": ["седан", "купе", "комби", "кабрио"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["форум", "клуб"] }], "wrd": ["автомоб"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["драйв"] }], "wrd": ["тест"], "rl": 5 }], "514": [{ "rl": 40, "wrd": ["метал"], "ir": [{ "wrd": ["черн", "цветн", "чорн", "кольоров", "прокат", "нерж"], "ir": [] }] }, { "rl": 0, "wrd": ["металлурги", "металургі", "бурени", "бурінн", "машиностро", "машинобудів", "шлакоблок"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["руд", "нефт", "нафт", "угл", "вугіл"] }], "wrd": ["добыч", "видоб", "обогащ", "збагач", "перероб"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["дерев", "метал", "стекл", "скло"] }], "wrd": ["оброб", "обработ"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["стал", "чугун", "труб", "вагон", "цистерн", "контейн", "бетон", "строй", "строит", "будів", "арматур", "фитинг", "фітінг", "станок", "станк", "верстат"] }], "wrd": ["производ", "виробн", "изготов", "виготов", "плав", "купит", "прода"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["столяр", "метал", "дерев", "рез", "токар", "трафарет", "сверл", "свердл", "чпу", "кругов", "фугов", "струг", "тиск", "шлифов", "шліфув", "обработ", "оброб", "лазер"] }], "wrd": ["стано", "станк", "верстат", "оборуд", "облад"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["свароч", "зварюв"] }], "wrd": ["апарат", "аппарат"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["гидравл", "гідравл", "кривошип", "термо"] }], "wrd": ["прес"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["стал", "жест", "рифл", "вытяж", "витяж"] }], "wrd": ["лист"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["промисл", "промышл", "строй", "будів", "строит", "добыч", "видоб"] }], "wrd": ["оборудован", "обладнан"], "rl": 30 }], "515": [{ "rl": 50, "wrd": ["вихован", "воспитан", "ігр", "игр", "психолог", "навчан", "обуч", "розви", "разви", "конкурс"], "ir": [{ "wrd": ["детей", "детск", "дітей", "дитяч", "ребенк", "дитин", "хлопч", "дівчин", "мальчик", "девочк", "малыш", "малюк", "младен"], "ir": [] }] }], "516": [{ "ir": [{ "ir": [], "wrd": ["питом", "животн", "тварин", "собак", "щенк", "кошк", "кота", "котов", "котят", "кішок", "котів", "кошек", "птиц", "птах", "пташ", "хорьк", "крыс", "свинк", "грызун", "гризун", "рептил", "крол", "хомяк", "шиншил"] }], "wrd": ["пропа", "корм", "домаш", "заболе", "хатн", "товар", "клетк", "вольер", "домик", "отда", "декорат", "карлик", "объявлен", "прода", "аксес", "одежд", "поилк"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["рыб", "риб", "кругл", "овальн", "подстав", "прям", "криш", "крыш"] }], "wrd": ["аквариум", "акваріум"], "rl": 30 }, { "ir": [], "wrd": ["royalcanin", "pedigree", "chappi", "whiskas", "kitekat", "зоотовар", "ветеринар"], "rl": 0 }], "517": [{ "rl": 60, "wrd": ["целюл", "загар", "морщин", "дезодор", "пилинг", "макияж", "зморш", "пілінг", "макіяж", "шампунь"], "ir": [] }, { "rl": 75, "wrd": ["космети", "дух", "парфюм", "туш", "пудр", "румян", "помад", "шампун", "одеколон", "пена", "гель"], "ir": [{ "wrd": ["декорат", "каталог", "купит", "женск", "мужск", "магазин", "жіноч", "чоловіч", "пробн", "просмотр", "орган", "натур"], "ir": [] }] }, { "rl": 60, "wrd": ["карандаш", "олів"], "ir": [{ "wrd": ["губ", "глаз", "бров", "очей"], "ir": [] }] }, { "rl": 60, "wrd": ["крем", "маск", "масл", "молочк", "гель"], "ir": [{ "wrd": ["рук", "руками", "ног", "ногами", "тела", "тело", "телом", "груд", "глаз", "глазами", "волос", "волосами", "тонал", "лица", "лицо", "ніг", "ногами", "тіла", "тіло", "тілом", "очей", "обличчя", "дезодор", "смягч", "питатель", "увлаж", "скраб", "защит", "захис", "зволож"], "ir": [] }] }, { "rl": 20, "wrd": ["вод"], "ir": [{ "wrd": ["туалет", "парфюм"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["парфюм"] }], "wrd": ["космет"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["космет", "натур", "детск", "дитяч", "арома"] }], "wrd": ["мило", "мыло"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["паста", "щетк", "щітк", "нит", "порош"] }], "wrd": ["зубн"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["волос", "ногт", "нігт"] }], "wrd": ["лак"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["помад", "блеск"] }], "wrd": ["губ"], "rl": 20 }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["век", "повік"] }], "wrd": ["для"] }], "wrd": ["тени", "тіні"], "rl": 30 }], "518": [{ "rl": 40, "wrd": ["офис", "склад", "помещен", "офіс", "приміщен", "гараж", "аутлет", "outlet"], "ir": [{ "wrd": ["аренд", "продаж", "покупк", "снят", "сдат", "купів", "здача", "здать"], "ir": [] }] }, { "rl": 20, "wrd": ["кварти"], "ir": [{ "wrd": ["офис", "офіс"], "ir": [] }] }, { "rl": 40, "wrd": ["коммерческ", "комерц"], "ir": [{ "wrd": ["недвижимост", "нерухом", "приміщ", "помещ"], "ir": [] }] }], "519": [{ "rl": 50, "wrd": ["игр", "ігр", "грат"], "ir": [{ "wrd": ["онлайн", "гон", "браузер", "бесплатн", "online", "драки", "компьютерн", "флеш", "стратег", "рпг", "стрел", "скач", "логич", "сетев", "флэш", "псп", "мморпг", "код", "безкошт", "міні", "комп'ютер", "стріл", "логі", "мереж", "fsp", "rpg", "mmorpg", "shooter", "шутер", "аркад", "приключ", "квест", "симулят", "экшн", "action", "головолом", "бродил", "платформ"], "ir": [] }] }, { "ir": [], "wrd": ["playstation", "wii", "xbox", "dreamcast", "sega"], "rl": 0 }], "520": [{ "rl": 50, "wrd": ["рубеж", "кордон", "вроп", "рубіж"], "ir": [{ "wrd": ["санатор", "турбаз", "хостел", "вилл", "готел", "пансіонат", "віл", "пляж", "отдых", "тур", "путешеств", "путев", "путів", "мандр", "відпоч", "подорож", "курорт", "кскурс"], "ir": [] }] }, { "rl": 60, "wrd": ["горяч", "горящ", "агенств", "поиск"], "ir": [{ "wrd": ["тур", "путев", "путешеств"], "ir": [] }] }, { "ir": [], "wrd": ["hotel"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["турци", "гипет", "франц", "сша", "герман", "малайз", "китай", "мексик", "мират", "испан", "болгар", "грузи", "кипр", "греци", "британ", "португ", "сингап", "середземн", "средиземн", "оае", "оаэ", "мальдив"] }], "wrd": ["отдых", "путев", "путешеств", "подор", "туры", "тури"], "rl": 30 }], "521": [{ "rl": 30, "wrd": ["англ", "француз", "мецк", "спанск", "китай", "японс", "язык", "мов", "intermed", "english", "deutsch"], "ir": [{ "wrd": ["курсы", "курси", "онлайн", "обучен", "разговорн", "розмовна", "изучен", "вивчен", "делово", "начинающих", "детей", "граммат", "бизнес", "навчан", "ділов", "початківців", "дітей", "бізнес", "трен", "занят", "репети", "школ"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["toefl", "ielts", "pet", "fce", "cae", "bec"] }], "wrd": ["exam", "кзамен", "тренин"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["перевод", "переклад", "язык", "мов"] }], "wrd": ["приложен", "додаток"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["англ", "француз", "мецк", "спанск", "китай", "японс", "язык", "мов", "english", "deutsch"] }], "wrd": ["словар", "словник", "разговорн", "розмовн"], "rl": 30 }], "522": [{ "rl": 50, "wrd": ["блендер", "вентилят", "вытяжк", "витяжк", "воздухоочис", "водонагр", "котлы", "котел", "измельч", "подрібнюв", "мясоруб", "комбайн", "микроволн", "мікрохвильов", "холодиль", "посудом", "свч", "чайник", "соковыжим", "фритюр", "йогуртниц", "вафельниц", "мороженниц", "фритюрниц", "хлебопеч", "чайник", "чиллер", "фэнкойл", "обогревател", "бойлер", "утюг", "пылесос", "стайлер", "эпилятор"], "ir": [{ "ir": [], "wrd": ["грн"] }] }, { "rl": 30, "wrd": ["техник", "технік"], "ir": [{ "wrd": ["встраив", "домашн", "вбудов", "побутов", "клімат"], "ir": [] }] }, { "rl": 50, "wrd": ["машин"], "ir": [{ "wrd": ["стирал", "кофе", "посудом", "швейн", "вязальн", "стрижк"], "ir": [{ "ir": [], "wrd": ["купит", "цен", "цін"] }] }] }, { "rl": 30, "wrd": ["плит"], "ir": [{ "wrd": ["газов", "электрическ"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["плит", "поверх", "духовк", "весы", "ваги"] }], "wrd": ["кухон", "варочн"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["кофе", "мульти", "паро"] }], "wrd": ["варк", "молк"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["сплит", "монобл", "внутр", "внешн"] }], "wrd": ["кондицион", "кондиціон"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["увлажн", "очистит", "осушит"] }], "wrd": ["воздух", "повітр"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["завес", "пушк"] }], "wrd": ["теплов"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["бритв", "массаж", "масаж"] }], "wrd": ["электро", "електро"], "rl": 10 }], "769": [{ "rl": 0, "wrd": ["внедорож", "джип", "кросовер", "кроссовер", "позашлях", "4wd", "awd", "4matic", "ssangyo", "4×4", "rav4"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["привод"] }], "wrd": ["полн"], "rl": 20 }], "770": [{ "ir": [], "wrd": ["позицион", "public", "promotion", "advertis", "commercial", "мерчандайз", "медиабренд", "спонсорств"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["реклам", "продук", "product"] }], "wrd": ["размещ", "place", "розміщ"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["акци", "кампан", "компан", "услуг", "аген", "прес", "радио", "актив", "интернет", "стойк", "борд", "квитанц", "ibox", "indoor", "метро", "фото", "agen", "автоб", "трансп", "наруж", "вывеск", "вивіск", "line"] }], "wrd": ["btl", "atl", "ttl", "relation", "пиар", "піар", "реклам", "маркетин", "market"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["витрин", "борд"] }], "wrd": ["видео"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["лого", "паков", "визитк", "флаер", "flier", "бренд", "brand"] }], "wrd": ["разраб", "розроб", "створ", "создан", "дизайн", "макет"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["сайт", "бренд"] }], "wrd": ["раскрут", "продвиж"], "rl": 30 }], "771": [{ "rl": 40, "wrd": ["мальчи", "девоч", "малыш", "ребенк", "детск", "хлопч", "дівч", "малюк", "дитяч", "детей"], "ir": [{ "wrd": ["кресл", "аксес", "бель", "вещ", "конструкт", "игр", "одежд", "мебел", "питан", "товар", "санк", "обув", "угол", "коляск", "крісл", "білиз", "реч", "одяг", "мебл", "харч", "взутт", "куто", "манеж", "ігр", "кресл", "крісл", "парт", "горш", "сиден", "весы", "ваги", "комнат", "кімнат"], "ir": [] }] }, { "rl": 0, "wrd": ["памперс", "гузни", "пеленк", "погремуш", "брязкальц", "пустышк", "пустушк", "ползунк", "ходунк", "прыгунк", "пеленатор", "манежниц"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["игрушк", "іграшк", "коврик"] }], "wrd": ["разви", "розви"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["игрушк", "іграшк", "фігурк"] }], "wrd": ["мягк", "мякі", "говорящ"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["оруж", "зброя", "техник", "машин", "железн", "радио", "радіо", "надувн", "авто"] }], "wrd": ["игруш", "іграш"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["радио", "видео", "радіо", "відео"] }], "wrd": ["нян"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["мобил", "мобіл", "мотоцик", "квадроцик"] }], "wrd": ["детск", "дитяч"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["прогул", "универсал", "аксес", "трансф", "книж", "трость"] }], "wrd": ["коляс", "люльк"], "rl": 40 }, { "ir": [{ "ir": [], "wrd": ["говорящ", "пласт", "интеракт", "девоч", "коляс"] }], "wrd": ["кукл", "кукол", "пупс"], "rl": 30 }], "772": [{ "rl": 40, "wrd": ["приготов", "приготув", "кухн", "духовк", "плит", "блюд", "завтрак", "обед", "ужин", "снідан", "обід", "вечер", "страв"], "ir": [{ "wrd": ["салат", "гарнир", "суп", "торт", "мяс", "рыб", "тесто", "выпечк", "десерт", "закуск", "гарнир", "риб", "випі", "тіст", "борщ", "пирог", "торт", "соус", "пирож", "блин", "млин", "пюре", "первое", "второе", "преш", "друг", "коктейл"], "ir": [] }] }, { "rl": 0, "wrd": ["кулинар", "кулінар", "специи", "специя", "приправ"], "ir": [{ "ir": [], "wrd": ["рецепт"] }] }, { "ir": [{ "ir": [], "wrd": ["овощ", "овоч", "помидор", "помідор", "огірк", "огурц", "перец", "томат"] }], "wrd": ["консерв"], "rl": 20 }], "773": [{ "rl": 60, "wrd": ["визаж", "пирсинг", "пилинг", "витализац", "візаж", "пірсинг", "пілінг", "віталізац", "массаж", "масаж", "парикмахер", "перукар"], "ir": [] }, { "rl": 40, "wrd": ["терап"], "ir": [{ "wrd": ["вакуум", "клеточ", "стоун", "клітков", "крио", "кріо"], "ir": [] }] }, { "rl": 40, "wrd": ["женск", "жіноч"], "ir": [{ "wrd": ["красот", "здоров"], "ir": [] }] }, { "rl": 20, "wrd": ["инъекц", "інєкц"], "ir": [{ "wrd": ["ботокс", "коллаген", "гиалур", "колаген", "гіалур"], "ir": [] }] }, { "rl": 60, "wrd": ["уход", "ухаж", "догляд"], "ir": [{ "wrd": ["кожей", "лица", "лицом", "телом", "бров", "волос", "спа", "шкіро", "обличч", "тіл", "кожа"], "ir": [] }] }, { "rl": 60, "wrd": ["лазер"], "ir": [{ "wrd": ["косметол", "омоло", "тату"], "ir": [] }] }, { "rl": 60, "wrd": ["средств", "засоб"], "ir": [{ "wrd": ["ванн", "депил", "загар", "массаж", "эпиляц", "целлюл", "депіляц", "масаж", "епіляц", "целюл"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["волос", "ногт", "нігт", "ресниц", "повік"] }], "wrd": ["наращ", "нарощ"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["красот", "краси", "массаж", "масаж"] }], "wrd": ["салон"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["спа", "spa", "омол"] }], "wrd": ["процедур"], "rl": 20 }], "774": [{ "rl": 200, "wrd": ["рубеж", "границ", "рубіж", "іспан", "испан", "італі", "итали", "франц", "герман", "німеч", "турц", "росси", "росі", "болгар", "чехія", "чехия", "кипр", "черногор", "латв", "грец", "чорногор", "хорват", "финлянд", "фінлянд", "норвег", "вроп"], "ir": [{ "wrd": ["недвижим", "квартир", "дом", "вилл", "артамент", "віл", "бунгал", "будин", "нерухоміст", "коттед", "котед"], "ir": [{ "ir": [], "wrd": ["куп", "прода", "аренд", "оренд", "сдат", "здат", "цен", "цін"] }] }] }], "775": [{ "rl": 50, "wrd": ["фильм", "фільм", "кіно", "кино"], "ir": [{ "wrd": ["зарубежн", "зарубіжн", "отечествен", "вітчизнян", "платн", "каталог", "премьер", "премєр", "онлайн", "новы", "новин", "рейтинг", "скача", "худож", "нові", "нови", "короткометр", "режис", "афиш", "афіш", "трейл", "тизер", "ролик"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["боевик", "бойов", "вестерн", "детектив", "драм", "сторич", "комед", "кримин", "кримін", "мульт", "анім", "аним", "триллер", "трилер", "ужас", "жах", "фантас", "фентез", "фэнтез", "биограф", "біограф"] }], "wrd": ["жанр", "фильм", "фільм"], "rl": 30 }], "776": [{ "rl": 40, "wrd": ["брониров", "бронюв"], "ir": [{ "wrd": ["билет", "онлайн", "интернет", "отел", "билет", "online", "номер", "стол", "стіл", "гостин"], "ir": [] }] }, { "rl": 40, "wrd": ["билет", "квит"], "ir": [{ "wrd": ["заказ", "купит", "замов", "авиа", "жд"], "ir": [] }] }, { "rl": 40, "wrd": ["касс", "каса", "каси"], "ir": [{ "wrd": ["авиа", "жд"], "ir": [] }] }], "777": [{ "rl": 30, "wrd": ["mba", "мба"], "ir": [{ "ir": [], "wrd": ["execut", "програм", "internation"] }] }, { "rl": 30, "wrd": ["master"], "ir": [{ "wrd": ["finance", "business", "management"], "ir": [] }] }, { "rl": 30, "wrd": ["бизнес", "економ", "менедж", "банк"], "ir": [{ "wrd": ["курс", "образов", "семинар", "семінар", "тренинг", "тренін", "форум", "школ", "навч", "освіт", "обуч", "шкіл"], "ir": [] }] }], "778": [{ "rl": 50, "wrd": ["компьютер", "комп'ютер"], "ir": [{ "wrd": ["шлейф", "корпус", "колонк", "блок", "памят", "памят", "клавиатур", "клавіатур", "настольн", "аксес", "монитор", "монітор", "персонал", "плат", "техник", "оборуд"], "ir": [] }] }, { "rl": 20, "wrd": ["оператив"], "ir": [{ "wrd": ["памят"], "ir": [] }] }, { "rl": 30, "wrd": ["накопи", "диск", "памят"], "ir": [{ "wrd": ["ssd", "hdd", "nas", "flash", "флеш", "внешн", "жестк", "зовніш", "жорстк", "flop", "usb"], "ir": [] }] }, { "rl": 30, "wrd": ["мыш", "миш"], "ir": [{ "wrd": ["оптич", "провод", "юсб", "usb", "коврик"], "ir": [] }] }, { "rl": 30, "wrd": ["карт"], "ir": [{ "wrd": ["видео", "звук", "сетев", "мережев", "материн"], "ir": [] }] }, { "rl": 0, "wrd": ["неттоп", "маршрутизат", "коммутатор", "роутер", "трансивер", "трансівер"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["raid"] }], "wrd": ["контрол", "масив"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["rj45", "sata", "pata", "ide", "ieee", "sas", "com"] }], "wrd": ["разъем", "розєм"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["hdmi", "dvi", "vga", "модем", "firewire", "sata"] }], "wrd": ["кабел"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["оптич"] }], "wrd": ["привод"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["внешн", "внутр", "зовн", "внутр"] }], "wrd": ["hdd"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["жк", "лсд", "lcd", "ips", "tft", "элт"] }], "wrd": ["монитор"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["intel", "amd"] }], "wrd": ["процес", "кристал"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["питан", "живлен"] }], "wrd": ["блок", "бесперебой"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["tx", "lx"] }], "wrd": ["корпус", "матер", "блок"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["оборуд", "облад"] }], "wrd": ["комуникац"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["камер"] }], "wrd": ["web"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["va", "вт"] }], "wrd": ["ups"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["оборуд", "обладн"] }], "wrd": ["dsl", "сетев", "мереж"], "rl": 20 }], "1025": [{ "rl": 80, "wrd": ["грузов"], "ir": [{ "wrd": ["авто", "запчаст", "купить", "прода", "шин", "рефрежир", "тент"], "ir": [] }] }, { "ir": [], "wrd": ["тягач", "полуприц", "півприч", "самосв", "самоск", "грузовик"], "rl": 0 }], "1026": [{ "rl": 40, "wrd": ["журнал", "газет"], "ir": [{ "wrd": ["коммерсант", "власт", "комерсант"], "ir": [] }] }, { "rl": 40, "wrd": ["управл", "керув"], "ir": [{ "wrd": ["проект", "людьми", "персонал", "предприяти", "финанс", "кадрам", "организац", "бизнес", "підприєм", "фінанс", "організац", "бізнес"], "ir": [] }] }, { "rl": 20, "wrd": ["директор"], "ir": [{ "wrd": ["генерал", "технич", "финанс", "исполнит", "техніч", "виконавч", "фінанс", "операц"], "ir": [] }] }, { "rl": 0, "wrd": ["ceo"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["звен", "высш", "средн", "середн", "вищ", "профес", "стратег", "такт", "уровен", "руковод"] }], "wrd": ["менедж"], "rl": 60 }], "1027": [{ "rl": 40, "wrd": ["детск", "дитяч", "детям", "дітям", "дітьм", "детьм", "ребён", "ребен", "малыш", "малюк", "детей", "дітей"], "ir": [{ "wrd": ["болезн", "диет", "еда", "еду", "еды", "клиник", "помощ", "стоматолог", "врач", "крем", "масл", "меню", "питани", "заболев", "космет", "гузник", "травм", "уход", "болниц", "хвороб", "дієт", "їжа", "клінік", "допомог", "лікар", "харч", "захвор", "догля", "купан"], "ir": [] }] }], "1028": [{ "rl": 40, "wrd": ["сад", "огород"], "ir": [{ "wrd": ["инструм", "земл", "почв", "грунт", "инвентар", "замаз", "вирощ", "выращ", "товар", "дач"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["трава", "кос", "ухаж", "уход", "догляд"] }], "wrd": ["газон"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["домаш", "огород", "садов", "декорат", "грунт", "земл", "привив", "подрез", "обрез", "подготов", "боле", "лечен", "хвор", "развед", "удобрен", "добрив", "вредит"] }], "wrd": ["растен", "рослин", "дерев", "цвет", "плод", "плід", "куст", "кущ"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["граб", "лопат", "моты", "ножн", "секат", "горш", "бинт", "цвет"] }], "wrd": ["садов"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["полив"] }], "wrd": ["шланг"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["волокн"] }], "wrd": ["агро"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["овощ", "карто", "дерев", "сажен", "цвет"] }], "wrd": ["посев", "посад"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["участ", "дільн"] }], "wrd": ["дачн"], "rl": 20 }, { "ir": [], "wrd": ["рассад", "розсад", "пикировк", "пікірув", "севооборот", "мотокос", "бензокос", "оприскув", "опрыскиват", "компост", "фитофтор", "культиватор", "кусторез"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["деревян", "поликарб", "кам", "сад", "гран"] }], "wrd": ["беседк", "бесідк"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["пруд", "став", "павильон", "павільйон", "скам", "лавоч", "кресл", "лавк", "мебел", "скульпт"] }], "wrd": ["сад", "дач"], "rl": 30 }], "1029": [{ "rl": 40, "wrd": ["медикам", "таблет"], "ir": [{ "wrd": ["сост", "упаков", "склад"], "ir": [] }] }, { "rl": 40, "wrd": ["лекарств", "лікарн", "медиц"], "ir": [{ "wrd": ["препарат", "опис"], "ir": [] }] }, { "ir": [], "wrd": ["витамин", "вітамін", "імуностимул", "иммуностимул", "медикамент"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["лечен", "антисепт", "тоніз", "тониз"] }], "wrd": ["средств"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["био", "минерал", "мінерал"] }], "wrd": ["добавки"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["похуд", "натур", "лечеб", "гомео", "гемор", "флор", "лікув", "био", "біо", "увелич", "восстанов", "віднов"] }], "wrd": ["препарат", "таблетк", "капсул", "пилюл", "свеч", "мазь", "гель", "бальзам"], "rl": 40 }], "1030": [{ "rl": 40, "wrd": ["квартир", "недвижимост", "жиль", "коттедж", "новострой", "котедж"], "ir": [{ "wrd": ["купит", "прода", "обмен", "покуп"], "ir": [] }] }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["город", "етаж", "этаж", "сел"] }], "wrd": ["дом", "дач"] }], "wrd": ["купит", "прод", "цен", "стоим", "обмен"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["цен", "стоим"] }], "wrd": ["недвижимост", "жиль", "коттедж", "новострой", "котедж"], "rl": 20 }], "1031": [{ "rl": 60, "wrd": ["клуб", "вечерин", "вечірк", "клаб", "club"], "ir": [{ "wrd": ["ночн", "флаер", "танц", "ретро", "нічн", "флаєр", "афиш", "афіш", "party", "dj", "концерт", "disco", "retro", "пати", "дидже", "bar"], "ir": [] }] }], "1032": [{ "rl": 50, "wrd": ["отдых", "путешеств", "тур"], "ir": [{ "wrd": ["детьми", "детей", "ребен", "семье", "семей"], "ir": [] }] }, { "rl": 50, "wrd": ["відпочин", "тур", "подорож"], "ir": [{ "wrd": ["дітьми", "сім", "дитин", "дітей"], "ir": [] }] }], "1033": [{ "rl": 0, "wrd": ["хобби", "хоббі"], "ir": [] }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["на"] }], "wrd": ["игр"] }], "wrd": ["обучен", "видео", "курс", "урок"], "rl": 40 }, { "ir": [{ "ir": [], "wrd": ["цвето", "садо"] }], "wrd": ["вод"], "rl": 10 }, { "ir": [], "wrd": ["самооборон"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["онлайн", "online", "дистанц", "комп", "видео", "язик", "мов", "авто", "спорт", "профес", "фото", "бухгалт", "практ", "риторик", "маникюр", "педикюр", "манікюр"] }], "wrd": ["обучен", "курс", "урок", "школ", "тренинг", "тренінг"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["центр"] }], "wrd": ["учебн", "учбов", "образ", "творч"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["товар", "набор"] }], "wrd": ["декупаж", "вишив", "вышив", "валян", "вяза", "мыловар"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["крюч", "спиц", "нитк"] }], "wrd": ["вяз"], "rl": 30 }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["шкатул", "набор"] }], "wrd": ["для"] }], "wrd": ["рукодел", "рукоділ"], "rl": 30 }], "1034": [{ "rl": 80, "wrd": ["телефон", "коммуникатор", "комунікатор", "смартфон"], "ir": [{ "wrd": ["сдма", "cdma", "гироскоп", "акселерометр", "камер", "дисплей", "каталог", "монобло", "слайдер", "сенсор", "сотов", "андр", "магазин", "мобил", "мобіл", "android", "ios", "расклад", "duos", "sim", "qwerty", "symbian", "blackber", "кумулят", "недорог"], "ir": [] }] }, { "rl": 60, "wrd": ["gprs", "edge", "gsm", "umts", "lte"], "ir": [] }], "1281": [{ "rl": 40, "wrd": ["авто", "внедорож", "джип", "седан", "позашлях"], "ir": [{ "wrd": ["люкс", "выстав", "премиум", "багат", "вистав", "преміум", "еліт", "элит", "престиж", "кабрио", "cabrio", "кабріо", "lux", "ксклюз", "роскош", "розкіш"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["премиум", "преміум", "концепт", "concept", "premium", "super", "супер", "lux"] }], "wrd": ["car", "кар"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["дорог"] }], "wrd": ["автомоб", "машин"], "rl": 20 }], "1282": [{ "rl": 30, "wrd": ["ипоте", "кредит", "ссуд"], "ir": [{ "wrd": ["квартир", "недвиж", "жиль", "дом", "молод"], "ir": [] }] }, { "rl": 30, "wrd": ["іпоте", "позик", "кредит"], "ir": [{ "wrd": ["квартир", "нерухом", "житл", "будин", "молод"], "ir": [] }] }], "1284": [{ "rl": 0, "wrd": ["бракосоч", "невест", "жених", "свадьб", "свадеб", "обручен", "помолв", "загс", "фата", "фату", "одруже", "заміж", "наречен", "весілл", "весільн", "заручен", "заручин"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["месяц"] }], "wrd": ["медов"], "rl": 10 }], "1285": [{ "rl": 40, "wrd": ["достат"], "ir": [{ "wrd": ["витамин", "почечн", "сердеч", "вітамін", "серцев", "нирк"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["терапев", "хирург", "хірург", "стоматол", "гінекол", "гинекол", "венерол", "неврол", "аллергол", "алергол", "психол", "наркол", "сексопат", "дермат", "проктол", "анестез", "урол", "кардиол", "педиат", "ортопед", "офтальм", "ндокр", "агност", "травмат", "трансплант", "полі", "поли", "маммол", "мамол"] }], "wrd": ["врач", "лікар", "медичн", "медиц", "пункт", "клини", "кліні", "консульт", "центр"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["ультра", "инфра", "гормон", "імун", "иммун", "цитолог", "кров", "моч", "кал", "госпитал", "госпітал", "бактер", "лаборат", "екг", "экг", "узи", "днк", "рентген"] }], "wrd": ["обследов", "обстежен", "аналіз", "анализ", "диагност", "діагност", "скоп"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["забол", "захвор", "лечен", "лікув", "маркер"] }], "wrd": ["онко"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["лечен"] }], "wrd": ["лазер"], "rl": 30 }, { "ir": [], "wrd": ["кардиогра", "кардіогра", "миокард", "міокард", "терапев", "хирург", "хірург", "стоматол", "гінекол", "гинекол", "венерол", "неврол", "аллергол", "алергол", "психол", "наркол", "дермат", "проктол", "кардиол", "офтальм", "ндокр"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["послуг", "услуг"] }], "wrd": ["врач", "лікар", "мед"], "rl": 20 }], "1286": [{ "rl": 40, "wrd": ["строит", "будів"], "ir": [{ "wrd": ["брус", "бетон", "кирпич", "почв", "грунт", "констру", "плитк", "пластик", "комлпекс", "фасад", "фундамент", "пристрой", "цемент", "компан", "тачк"], "ir": [] }] }, { "rl": 40, "wrd": ["ремонт"], "ir": [{ "wrd": ["потол", "стен", "сантехн", "фундамент", "стел", "стін", "фасад", "комплекс", "гарант", "кварт", "дом", "кухн", "кухон", "офис", "коттедж", "офіс", "котедж", "комнат", "космет", "капит", "капіт", "евро", "євро", "новострой", "комплекс", "качеств", "материал", "помещ"], "ir": [] }] }, { "rl": 0, "wrd": ["кровл", "линолеум", "паркет", "покрівл", "будівниц", "лінолеум", "перфорат", "дрель", "дрели", "дриль", "дрилі", "болгарк", "смесител", "метиз", "псокартон", "вагонка", "штукатурк", "шпатлевк", "грунтовк", "мастика", "саморез", "воздуховод", "калорифер"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["пил", "ручн"] }], "wrd": ["инструмент", "інструмент"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["верт"] }], "wrd": ["шуруп", "гайк", "винт"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["машин"] }], "wrd": ["шлифов", "шліфув"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["кабин", "кабін"] }], "wrd": ["душ"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["шаров"] }], "wrd": ["кран"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["чугун", "стал", "плоск", "биметал"] }], "wrd": ["радиатор", "батаре", "радіатор"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["цемент", "пол"] }], "wrd": ["стяжк"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["хаус", "хауз"] }], "wrd": ["блок"], "rl": 5 }, { "ir": [{ "ir": [], "wrd": ["водо", "лак", "емал", "эмал", "матов", "акрил", "внутр", "внешн"] }], "wrd": ["краск", "фарб"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["ван", "пол"] }], "wrd": ["труб"], "rl": 20 }], "1287": [{ "rl": 50, "wrd": ["марка", "марку", "марки", "монет", "икона", "ікона", "иконы", "икону", "ікони", "ікону", "картин"], "ir": [{ "wrd": ["куп", "прода", "обмен", "старин", "раритет", "каталог", "стоим", "обмін", "старов", "вартіс"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["оружи", "зброя", "монет", "значк", "жетон", "марк", "деньг", "грош", "книг", "книж", "картин", "утвар", "кокард", "медал", "складн", "наград", "нагород", "значк", "мебел", "артефак", "отлич"] }], "wrd": ["коллекц", "колекц", "раритет", "редк", "рідк", "антиквар", "драг", "древн", "антич"], "rl": 50 }, { "ir": [], "wrd": ["нумизмат", "бонист", "бирофил", "флумен", "фларист", "сфрагист", "антиквар"], "rl": 0 }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["сплав"] }], "wrd": ["драг", "дорог"] }], "wrd": ["монет"], "rl": 40 }], "1288": [{ "rl": 40, "wrd": ["украин", "україн", "крым", "карпат", "крим", "трускав", "каменец", "камянець", "львов", "львів", "почаев", "почаїв", "говерл", "буковел", "уман", "батурин", "трипол", "трипіл", "канев", "корсун"], "ir": [{ "wrd": ["гостиниц", "кскурс", "отел", "пансионат", "санатор", "турбаз", "хостел", "пансіонат", "пляж", "отдых", "путешеств", "путев", "путівн", "мандрів", "відпоч", "подорож", "курорт", "маршрут", "тури"], "ir": [] }] }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["украине", "україні", "крим", "крым", "карпат"] }], "wrd": ["по"] }], "wrd": ["тур"], "rl": 40 }], "1290": [{ "rl": 60, "wrd": ["оборуд", "техник", "обладнан", "технік", "парат"], "ir": [{ "wrd": ["офис", "копир", "офіс", "копіюв", "печат"], "ir": [] }] }, { "rl": 60, "wrd": ["устройств", "пристрі"], "ir": [{ "wrd": ["многофункционал", "багатофункціон"], "ir": [] }] }, { "rl": 60, "wrd": ["уничтож", "знищувач"], "ir": [{ "wrd": ["бумаг", "докум", "папер"], "ir": [] }] }, { "rl": 40, "wrd": ["доск", "дошк"], "ir": [{ "wrd": ["маркер", "нтерактивн"], "ir": [] }] }, { "rl": 20, "wrd": ["телефон"], "ir": [{ "wrd": ["станц", "стац"], "ir": [] }] }, { "rl": 0, "wrd": ["сканер", "шредер", "принтер", "оргтехник", "ксерокс", "ламинатор", "биндер", "флипчарт", "оргтехнік", "ламінатор", "біндер", "фліпчарт", "плоттер", "плотер"], "ir": [] }], "1537": [{ "rl": 0, "wrd": ["мотоцикл", "моторол", "скутер", "чопп", "харлей", "квадроцик", "мототехн", "мопед"], "ir": [] }], "1538": [{ "rl": 30, "wrd": ["авто", "мобил", "мобіл"], "ir": [{ "wrd": ["кредит", "ссуд", "позик", "займ", "заем", "заём", "залог", "застав", "лизинг", "лізінг", "ломбард", "аренд", "оренд", "взнос"], "ir": [] }] }], "1541": [{ "rl": 40, "wrd": ["занят", "клуб", "центр"], "ir": [{ "wrd": ["йог", "аэробик", "аеробік", "бассейн", "басейн", "фитнес", "фітнес", "медитац", "спортзал", "тренаж", "пилатес", "пілатес", "эквилибр", "еквілібр", "фейсформ"], "ir": [] }] }, { "ir": [], "wrd": ["фейсформин", "фейсбилдин", "фейсформін", "фейсбілд"], "rl": 2 }], "1543": [{ "rl": 80, "wrd": ["музык", "музик", "музич", "music", "песн", "пісн", "мелод"], "ir": [{ "wrd": ["джаз", "метал", "рок", "панк", "реп", "рэп", "блюз", "транс", "хаус", "лектр", "денс", "техно", "поп", "альтерн", "качат", "завантаж", "загруз", "послу", "мп3", "mp3", "телефон", "релакс", "танц", "исполнит", "клип", "реклам", "рубеж", "клубн", "платн", "альбом", "виконав", "кліп", "рубіж", "безкошт", "кино", "кіно", "фільм", "фильм", "серіал", "сериал", "лаунж", "relax", "rock", "pop", "classic", "rap", "шансон", "клас", "хит", "хіт", "house", "electr", "mix", "гурт", "груп", "flac", "співа", "сборник", "збірник", "нструмент"], "ir": [] }] }, { "ir": [], "wrd": ["саундтрек", "soundtrack", "минусовк", "мінусовк", "аранжиров", "аранжув"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["новый", "новий", "выпус", "випус"] }], "wrd": ["альбом", "сингл"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["пісн", "песн", "груп"] }], "wrd": ["распозн", "розпізн"], "rl": 20 }], "1546": [{ "rl": 40, "wrd": ["камер"], "ir": [{ "wrd": ["цифров", "зеркал"], "ir": [] }] }, { "rl": 30, "wrd": ["расстоян", "відстан"], "ir": [{ "wrd": ["фокус", "оптич"], "ir": [] }] }, { "rl": 0, "wrd": ["фотоап", "зеркалк", "объектив", "диафрагм", "светофильтр", "софтбокс", "фотобокс", "фототехник", "штатив"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["сумк", "рюкзак", "чемод", "чех", "аксес"] }], "wrd": ["фото"], "rl": 10 }], "1794": [{ "rl": 40, "wrd": ["кредит", "позик", "рассроч", "розстроч"], "ir": [{ "wrd": ["техник", "велосип", "компьют", "нужд", "образов", "ремонт", "телефон", "ноутбук", "отдых", "потребил", "скутер", "стоматолог", "путешеств", "путев", "мебель", "грош", "готівк", "деньг", "товар", "наличн"], "ir": [] }] }], "1799": [{ "rl": 50, "wrd": ["одежд", "вещ", "одяг", "обув", "юбк", "брюк", "шорт", "костюм", "блузк", "жакет", "куртк", "кроссовк", "кросівк", "белье", "туник", "рубашк", "футболк", "сорочк"], "ir": [{ "wrd": ["бренд", "мод", "весен", "верхн", "осен", "зимн", "гламур", "джинс", "дизайн", "каталог", "летн", "магаз", "красив", "купит", "заказ", "мужск", "женск", "милитар", "размер", "стил", "современ", "офис", "весн", "осін", "зим", "літн", "чоловіч", "жіноч", "мілітар", "розмір", "сучасн", "офіс", "бутик", "сезон"], "ir": [] }] }, { "rl": 40, "wrd": ["плать", "платт"], "ir": [{ "wrd": ["вечер", "выпуск", "коротк", "длин", "ретр", "стил", "випуск", "довг", "коктейл", "офис", "офіс"], "ir": [] }] }, { "rl": 40, "wrd": ["модн", "стиль"], "ir": [{ "wrd": ["лет", "весн", "зим", "осен", "полн", "журнал", "женск", "мужск", "современ", "улич", "тенденц", "літ", "осін", "повн", "жін", "чолов", "сучасн", "бутик"], "ir": [] }] }, { "rl": 0, "wrd": ["бижутери", "кутюр", "cotoure", "біжутер", "бикини", "бікіні", "купальник"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["солнц", "сонц"] }], "wrd": ["очки", "окуляр"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["женск", "кожан", "ксклюзив", "мужск", "школ", "спорт", "клатч", "ноут"] }], "wrd": ["сумк", "сумочк", "портфель"], "rl": 30 }], "2050": [{ "rl": 50, "wrd": ["кредит", "ссуд", "заем", "заём", "позик", "займ"], "ir": [{ "wrd": ["бизнес", "инвестиц", "коммер", "корпора", "препри", "сельск", "юрид", "бізнес", "інвестиц", "комерц", "підприєм", "сільск"], "ir": [] }] }], "2055": [{ "rl": 40, "wrd": ["охот", "рыб", "мислив", "риб"], "ir": [{ "wrd": ["одежд", "одяг", "спорядж", "снаряж", "крюч", "грузил", "леск", "шнур", "волос", "катушк", "спорт", "трофей"], "ir": [] }] }, { "rl": 0, "wrd": ["удочк", "охота", "спиннинг", "ружь", "спінінг", "мислив", "рушниц", "холот", "воблер", "поппер", "ультралайт"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["надувн", "пласт"] }], "wrd": ["лодк"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["карп", "карас", "щук", "сом", "плотв", "лещ", "лящ", "жерех", "судак", "риб", "рыб"] }], "wrd": ["лов", "пойм"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["винтовк", "гвинт", "пистол", "пістол", "пруж", "компрес"] }], "wrd": ["пневмат"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["раздел", "шкур"] }], "wrd": ["нож"], "rl": 20 }], "2306": [{ "rl": 0, "wrd": ["кредит", "ссуд", "позик"], "ir": [] }, { "rl": 40, "wrd": ["деньг", "денеж", "грош"], "ir": [{ "wrd": ["долг", "борг", "заем", "заём", "займ"], "ir": [] }] }], "2311": [{ "rl": 40, "wrd": ["спорт"], "ir": [{ "wrd": ["диет", "питан", "харчув", "занят", "дневни", "рацион", "дієт", "щоденн", "раціон"], "ir": [] }] }, { "rl": 0, "wrd": ["бодибилд", "бодібілд", "орбітрек", "орбитрек", "гантел"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["профес", "вело", "липтичн", "ліптичн", "греб", "штанг", "гантел", "диск", "гир", "гриф", "спорт", "сил", "цен", "купит"] }], "wrd": ["тренажер"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["диск", "блин", "wz", "ez"] }], "wrd": ["штанг", "гриф"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["дорож", "доріж"] }], "wrd": ["бегов", "бігов"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["шведск"] }], "wrd": ["стенк"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["фитнес", "фітнес"] }], "wrd": ["станц"], "rl": 10 }], "2562": [{ "rl": 20, "wrd": ["виз", "віз", "visa"], "ir": [{ "wrd": ["gold", "голд"], "ir": [] }, { "wrd": ["classic", "клас"], "ir": [] }, { "wrd": ["electron", "platinum", "платинум", "silver"], "ir": [] }, { "wrd": ["карт"], "ir": [] }] }, { "rl": 50, "wrd": ["карт"], "ir": [{ "wrd": ["кредит", "дебет", "кредіт", "банк"], "ir": [] }, { "wrd": ["maestro", "маэстро", "mastercard", "eurocard", "expres"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["интернет", "internet", "sms", "овердрафт", "payment", "automatic"] }], "wrd": ["банкинг", "банкінг", "banking"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["standart", "gold"] }], "wrd": ["mastercard"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["expres"] }], "wrd": ["americ"], "rl": 5 }, { "ir": [{ "ir": [], "wrd": ["плат", "карт"] }], "wrd": ["overdraft", "овердрафт"], "rl": 30 }], "2567": [{ "rl": 40, "wrd": ["смотр", "видео", "тб", "телевиден", "телебач", "тв"], "ir": [{ "wrd": ["онлайн", "online"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["виден", "бачен", "канал", "програм", "расписан", "шоу", "розклад", "передач", "сериал", "серіал", "новел", "гид"] }], "wrd": ["теле"], "rl": 10 }, { "ir": [], "wrd": ["токшоу"], "rl": 0 }], "2818": [{ "rl": 50, "wrd": ["банк"], "ir": [{ "wrd": ["филиал", "філіал", "отделен", "банкомат", "відділ", "интернет", "інтернет", "коммерч", "комерц", "услуг", "послуг", "рейтинг", "сейф", "обслу", "ячей", "счет", "рахун", "депоз", "заруб"], "ir": [] }] }, { "ir": [], "wrd": ["факторинг", "инкасс", "інкас"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["кредит", "депозит"] }], "wrd": ["продукт"], "rl": 10 }], "2823": [{ "rl": 40, "wrd": ["жива", "живо"], "ir": [{ "wrd": ["музык", "музик"], "ir": [] }] }, { "rl": 40, "wrd": ["банкет"], "ir": [{ "wrd": ["зал"], "ir": [] }] }, { "rl": 40, "wrd": ["заказ", "замов", "бронир", "бронюв"], "ir": [{ "wrd": ["столик", "стіл"], "ir": [] }] }, { "rl": 0, "wrd": ["пабы", "пабе", "кафе", "пивная", "пивной", "ресторан", "трактир", "пивоварн", "баре", "пиццери", "піцері", "кофейня", "кофейни", "кофейне", "кавярн", "гостини", "хостел"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["номер"] }], "wrd": ["снять", "зняти", "отел"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["мини", "міні", "бізнес", "бизнес"] }], "wrd": ["отель"], "rl": 10 }], "3074": [{ "rl": 40, "wrd": ["депозит", "вклад"], "ir": [{ "wrd": ["денежн", "банк", "валютн", "накопи", "процент", "гривн", "рубл", "доллар", "евро", "срочн", "ставк", "грошов", "долар", "термін"], "ir": [] }] }], "3079": [{ "rl": 30, "wrd": ["automation"], "ir": [{ "wrd": ["engineer", "develop"], "ir": [] }] }, { "rl": 12, "wrd": ["studio"], "ir": [{ "wrd": ["visual", "aptana", "embarcadero", "borland", "sun"], "ir": [] }] }, { "rl": 30, "wrd": ["проект", "создан", "створ", "разраб", "розроб", "верст"], "ir": [{ "wrd": ["обеспеч", "софт", "сайтов"], "ir": [] }] }, { "rl": 30, "wrd": ["админинстр", "адміністр"], "ir": [{ "wrd": ["систем", "сервер"], "ir": [] }] }, { "rl": 0, "wrd": ["develop", "application", "c++", "delphi", "pascal", "fortran", "jquery", "komodo", "netbeans", "objectiveс", "perl", "python", "ruby", "software", "sql", "framework", "firmware"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["технол", "technol"] }], "wrd": ["информ", "інформ", "inform"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["атриб", "html"] }], "wrd": ["тег"], "rl": 20 }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["игр", "ігор", "ігр", "програм", "систем", "обеспеч"] }], "wrd": ["комп", "софт", "програм"] }], "wrd": ["разраб", "розроб", "создан", "створ", "проект"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": [".net", "xna", "1c", "frame", "java", "eclipse", "posix"] }], "wrd": ["платформ", "студи"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["builder", "c"] }], "wrd": ["borland"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["win32"] }], "wrd": ["api"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["данных", "даних"] }], "wrd": ["баз"], "rl": 5 }, { "ir": [{ "ir": [], "wrd": ["провайдер"] }], "wrd": ["нтернет"], "rl": 30 }], "3330": [{ "rl": 50, "wrd": ["вложен", "вкладен"], "ir": [{ "wrd": ["автоном", "внешн", "внутр", "краткосрочн", "долгосрочн", "доходн", "зарубежн", "выгодн", "дене", "зовнішн", "короткочасн", "довготривал", "дохідн", "зарубіж", "вигідн", "грош"], "ir": [] }] }, { "rl": 40, "wrd": ["бирж"], "ir": [{ "wrd": ["брокер", "рынок", "курс", "индекс", "акц", "торг", "фонд", "ринк", "індекс", "инвест", "інвест"], "ir": [] }] }, { "rl": 0, "wrd": ["вексел", "котиров", "облигаци", "инвестиц", "фьючерс", "капиталов", "облігаці", "інвестиц", "ф'ючерс", "варран", "дериват", "венчур"], "ir": [] }, { "rl": 30, "wrd": ["фонд"], "ir": [{ "wrd": ["ринок", "ринк", "рынк", "рынок"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["ринок", "рынок"] }], "wrd": ["срочн"], "rl": 10 }], "3335": [{ "rl": 50, "wrd": ["выставк", "галере", "виставк"], "ir": [{ "wrd": ["живопис", "картин", "фотограф", "худож", "цвет", "книж", "искусств", "квіт", "мистец", "истор", "істор", "шедевр"], "ir": [] }] }, { "rl": 0, "wrd": ["филармон", "фестив", "концерт", "музей", "спектакл", "філармон", "оркестр", "мистец", "художник", "мемуар"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["культур", "худож", "сцен", "образ", "архитект", "скульпт", "живопис", "худож", "перформ"] }], "wrd": ["искусств", "мистецтв", "art"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["каса", "касса", "билет", "білет", "спектакл", "выстав"] }], "wrd": ["театр"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["худож", "фантаст", "фентез", "фэнтез", "украин", "україн", "зарубеж", "зарубіж", "детск", "дитяч", "любовн", "сторич", "иностран"] }], "wrd": ["книг", "литератур", "літератур", "роман"], "rl": 40 }], "3586": [{ "rl": 50, "wrd": ["бирж", "бірж"], "ir": [{ "wrd": ["лектрон", "валют", "метал", "нефт", "обучен", "онлайн", "торг", "нтернет", "курс", "международ", "лондон", "миров", "акци", "финанс", "нафт", "навчан", "міжнародн", "світов", "акці", "фінанс"], "ir": [] }] }, { "rl": 10, "wrd": ["курс", "рынок", "рынк", "ринк", "ринок"], "ir": [{ "wrd": ["валют"], "ir": [] }] }, { "rl": 0, "wrd": ["котировк", "трейдер", "форекс", "фьючерс", "ф'ючерс"], "ir": [] }], "3591": [{ "rl": 80, "wrd": ["парт"], "ir": [{ "wrd": ["блок", "блочн"], "ir": [] }, { "wrd": ["регион", "комунист", "консерв", "либерал", "ліберал", "регіон", "национал", "націонал"], "ir": [] }, { "wrd": ["парламент", "полити", "політи"], "ir": [] }] }, { "rl": 50, "wrd": ["рад", "совет"], "ir": [{ "wrd": ["верхов", "обласн", "район", "сільск", "сельск", "городск", "міськ"], "ir": [] }] }, { "rl": 30, "wrd": ["спікер", "спикер"], "ir": [{ "wrd": ["парламен"], "ir": [] }] }, { "rl": 0, "wrd": ["референдум", "консульство", "парламент"], "ir": [] }, { "rl": 0, "wrd": ["оппозици", "коалиц"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["комисс", "коміс", "верхов", "парлам", "район", "презид", "обласн", "городс", "міськ", "округ", "дільн"] }], "wrd": ["вибор", "избир", "выбор", "кандидат"], "rl": 60 }, { "ir": [{ "ir": [], "wrd": ["цвк", "верхов", "парт", "рга"] }], "wrd": ["голов", "глав", "председ"], "rl": 20 }, { "ir": [], "wrd": ["мініст", "минист", "депутат"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["кредит"] }], "wrd": ["мвф"], "rl": 30 }, { "ir": [], "wrd": ["баллотир", "балотув"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["прий", "прин"] }], "wrd": ["закон"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["стран", "країн", "официал", "офіціал", "візит", "визит"] }], "wrd": ["посол", "послы"], "rl": 40 }], "3842": [{ "rl": 30, "wrd": ["страх"], "ir": [{ "wrd": ["авто", "машин", "мотоц", "транспорт", "угон", "машин", "трактор"], "ir": [] }] }, { "ir": [], "wrd": ["автограждан", "автоцивіл", "автоцивил", "осаго", "дсаго", "каско"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["карт"] }], "wrd": ["зелен"], "rl": 10 }], "3847": [{ "rl": 40, "wrd": ["имен", "імен"], "ir": [{ "wrd": ["совместимост", "мужск", "женск", "тайн", "тлумачен", "толкован", "значен", "сумісн", "чоловіч", "жіноч", "таємн"], "ir": [] }] }, { "rl": 20, "wrd": ["гороскоп"], "ir": [{ "ir": [], "wrd": ["ежедневн", "зодиак", "зодіак", "китайск", "древн", "японск", "друид", "кельт", "зороастр", "совмест", "сумісн", "любовн", "меся", "лунн", "год", "річ", "рік"] }] }, { "ir": [{ "ir": [], "wrd": ["овен", "телец", "близн", "рак", "козерог", "стрелец", "водол", "лев", "дев", "скорпион", "вес", "рыб"] }], "wrd": ["знак", "сегодн", "сьогодн"], "rl": 30 }, { "ir": [], "wrd": ["нумеролог", "сонник", "астролог"], "rl": 0 }], "4098": [{ "rl": 50, "wrd": ["страхов", "страхув", "астрах"], "ir": [{ "wrd": ["медичн", "медиц", "сотрудн", "здоров", "спортсмен", "личн", "співробітн", "особист", "боле", "хвор"], "ir": [] }] }, { "ir": [{ "ir": [{ "ir": [], "wrd": ["добров", "обязат", "обовязк"] }], "wrd": ["мед"] }], "wrd": ["страхов", "страхув", "астрах"], "rl": 80 }, { "ir": [{ "ir": [], "wrd": ["мед"] }], "wrd": ["полис", "поліс"], "rl": 20 }], "4354": [{ "rl": 30, "wrd": ["страхов", "страхув"], "ir": [{ "wrd": ["дом", "квартир", "имуществ", "дач", "жиль", "здан", "залог", "недвижим", "оборуд", "будинк", "майн", "житл", "будівель", "нерухомост", "обладнан", "гараж", "мебел", "техник", "постройк", "предмет", "участ"], "ir": [] }] }], "4610": [{ "rl": 40, "wrd": ["страх", "страхув"], "ir": [{ "wrd": ["виз", "выезж", "рубеж", "путешеств", "тури", "поезд", "віз", "виїз", "рубіж", "подорож", "поїзд", "шенген"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["турист"] }], "wrd": ["полис", "поліс"], "rl": 50 }], "4866": [{ "rl": 30, "wrd": ["страх", "страхув"], "ir": [{ "wrd": ["жизн", "корпоративн", "накопительн", "детей", "детск", "смерт", "несчаст", "життя", "накопичув", "дітей", "дитяч", "нещасн", "осіб", "особ"], "ir": [] }] }], "5122": [{ "rl": 40, "wrd": ["страх", "страхув"], "ir": [{ "wrd": ["бизнес", "ответствен", "риск", "кредит", "предприят", "депозит", "титул", "деятельн", "бізнес", "відповідал", "ризик", "підприємств", "діяльн", "склад", "магазин", "предприн", "трейдер", "торгов", "строит", "организат", "перевоз"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["бізнес", "бизнес"] }], "wrd": ["полис", "поліс"], "rl": 30 }], "5378": [{ "rl": 40, "wrd": ["страхован", "страхуван", "астрах"], "ir": [{ "wrd": ["виды", "види", "договор", "обязател", "онлайн", "ресо", "росгос", "фирм", "организац", "калькулят", "универс", "кспрес", "обовязк", "фірм", "організац"], "ir": [] }] }], "5634": [{ "rl": 0, "wrd": ["адвокат", "юрист", "юридич", "кодекс", "нотари", "арбитраж", "арбітраж", "нотарі", "конституц", "постанов", "ратификац", "ратифікац", "кадастр"], "ir": [] }, { "rl": 40, "wrd": ["процес"], "ir": [{ "wrd": ["сопрово", "супров"], "ir": [] }] }, { "rl": 40, "wrd": ["взыскан", "стягн"], "ir": [{ "wrd": ["долг", "борг"], "ir": [] }] }, { "rl": 40, "wrd": ["документ", "договор", "заяв", "акт"], "ir": [{ "wrd": ["возобновл", "оформлен", "знан", "регистр", "составл", "подготов", "відновл", "складен", "реєстр"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["справ", "дел", "докум", "держ", "админ", "адмін", "контитуц", "вроп", "верхов"] }], "wrd": ["суд"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["оформл", "подготов", "підготов", "нотар"] }], "wrd": ["договор", "договір", "доверенность", "довіреність", "свидетельств", "свідоцтв", "завещан", "заповіт", "заявлен", "заяв", "документ", "соглас", "згод", "паспорт"], "rl": 80 }, { "ir": [{ "ir": [], "wrd": ["технич", "техніч", "строит", "будів", "земель", "участ", "дільниц"] }], "wrd": ["паспорт"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["полномоч", "повноваж"] }], "wrd": ["закон"], "rl": 50 }, { "ir": [{ "ir": [], "wrd": ["про", "акт", "прав", "проект", "дав", "дат"] }], "wrd": ["закон", "норматив"], "rl": 5 }, { "ir": [{ "ir": [], "wrd": ["изменен", "змін"] }], "wrd": ["порядок", "закон"], "rl": 10 }], "5890": [{ "rl": 50, "wrd": ["бирж", "бірж"], "ir": [{ "wrd": ["работ", "праці", "зайнят", "занят"], "ir": [] }] }, { "rl": 50, "wrd": ["агенств"], "ir": [{ "wrd": ["персонал", "hr", "рекрут", "кадров", "хант", "hunt"], "ir": [] }] }, { "rl": 0, "wrd": ["ваканс", "резюме", "стажир", "стажув", "собесед", "співбесід", "трудоустр", "працевлашт"], "ir": [] }, { "rl": 30, "wrd": ["работ", "прац"], "ir": [{ "wrd": ["офис", "удален", "частичн", "стаж", "квалифи", "кваліфік", "график", "дистанц", "дома", "надом", "сезон", "офіс", "частков", "графік", "предлож", "пропоз", "разд", "специал", "спеціал", "карьер", "карєр"], "ir": [] }] }, { "rl": 50, "wrd": ["плат"], "ir": [{ "wrd": ["зароб", "часов", "оклад"], "ir": [] }] }, { "rl": 50, "wrd": ["рост", "ріст"], "ir": [{ "wrd": ["карьер", "профес", "кар'єр"], "ir": [] }] }, { "rl": 50, "wrd": ["профес", "специал", "спеціал"], "ir": [{ "wrd": ["деятельн", "квалифик", "требов", "обязател", "практик", "діяльн", "кваліфік", "вимог", "обов'яз"], "ir": [] }] }, { "rl": 40, "wrd": ["образовани", "освіт"], "ir": [{ "wrd": ["высш", "средн", "вищ", "середн"], "ir": [] }] }, { "rl": 50, "wrd": ["занят", "зайнят"], "ir": [{ "wrd": ["полн", "повн", "част"], "ir": [] }] }, { "ir": [{ "ir": [], "wrd": ["повышен", "підвищ", "повыси"] }], "wrd": ["квалифик", "кваліфік"], "rl": 20 }], "6155": [{ "rl": 20, "wrd": ["планшет", "tab", "pad"], "ir": [{ "ir": [], "wrd": ["пк", "комп", "андроид", "ios", "window", "android", "apple", "pc", "купит", "искат", "категор", "чехол", "чохол", "плен", "3g", "интернет", "інтернет", "новий", "новый", "обзор"] }] }, { "ir": [{ "ir": [], "wrd": ["tab", "pad"] }], "wrd": ["планшет"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["книг", "книж"] }], "wrd": ["електрон", "электрон"], "rl": 20 }], "6411": [{ "rl": 30, "wrd": ["ноутбук", "нетбук", "лептоп", "лэптоп"], "ir": [] }, { "ir": [{ "ir": [], "wrd": ["бук"] }], "wrd": ["ультра", "трансформ", "слик"], "rl": 30 }], "6667": [{ "rl": 50, "wrd": ["ребен", "мальчик", "девочк", "малыш", "детен"], "ir": [{ "wrd": ["1", "2", "3", "одно", "двух", "трех"], "ir": [{ "wrd": ["лет", "год"], "ir": [] }] }, { "wrd": ["1", "2", "3", "4", "5", "6", "7", "8", "9"], "ir": [{ "wrd": ["мес"], "ir": [] }] }, { "wrd": ["однолет", "двухлет", "трехлет", "новорожд", "маленк"], "ir": [] }, { "wrd": ["от"], "ir": [{ "wrd": ["0", "1", "год"], "ir": [{ "wrd": ["до"], "ir": [{ "wrd": ["0", "1", "2", "3"], "ir": [{ "ir": [], "wrd": ["лет"] }] }] }] }] }] }, { "rl": 50, "wrd": ["дитин", "дітк", "малюк", "хлопчик", "дівчинк"], "ir": [{ "wrd": ["1", "2", "3", "один", "два", "три"], "ir": [{ "wrd": ["рік", "роки"], "ir": [] }] }, { "wrd": ["1", "2", "3", "4", "5", "6", "7", "8", "9"], "ir": [{ "wrd": ["міс"], "ir": [] }] }, { "wrd": ["однорічн", "дворічн", "трьохрічн", "новонароджен", "маленьк"], "ir": [] }, { "wrd": ["1", "2", "3"], "ir": [{ "ir": [], "wrd": ["рок"] }] }, { "wrd": ["від"], "ir": [{ "wrd": ["0", "1", "рок"], "ir": [{ "wrd": ["до"], "ir": [{ "wrd": ["1", "2", "3"], "ir": [] }] }] }] }] }], "8459": [{ "ir": [{ "ir": [], "wrd": ["давлен", "тиск"] }], "wrd": ["атмосфер"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["без", "возмож", "можлив", "вероятн", "вірогід"] }], "wrd": ["опад", "осадк"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["гидро", "гідро", "метеорол"] }], "wrd": ["центр"], "rl": 10 }, { "ir": [], "wrd": ["gismeteo", "sinoptik"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["город", "украин", "крым", "крим", "прогноз", "утр", "вечер", "днем", "ден", "ран", "ноч"] }], "wrd": ["погод", "температур"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["воздух", "повітр", "дніпр", "мор", "водо", "прогноз", "показат", "показник"] }], "wrd": ["температур"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["бур", "обстановк"] }], "wrd": ["магнит", "магніт"], "rl": 20 }], "8715": [{ "ir": [{ "ir": [], "wrd": ["жизнь", "пара", "свадьб", "дет", "роман", "житт", "весілл", "діт", "новост", "новин", "теле", "фотосес", "беремен", "вагітн", "шоу"] }], "wrd": ["звезд", "зірк", "знаменит"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["бизнес", "бізнес", "мен", "новин", "новост"] }], "wrd": ["шоу"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["жизн", "житт", "событ", "поді"] }], "wrd": ["светск", "світськ"], "rl": 40 }, { "ir": [{ "ir": [], "wrd": ["новост", "новин"] }], "wrd": ["гламур"], "rl": 20 }, { "ir": [], "wrd": ["певица", "певец"], "rl": 0 }], "8971": [{ "ir": [{ "ir": [], "wrd": ["сбоз", "збір", "обществ", "товариств", "предпр", "підприєм", "капитал", "капітал"] }], "wrd": ["акци", "акці"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["гарант", "тайн", "рот", "внешн", "зовнішн", "всемир", "евро", "євро", "сектор", "национал", "націонал", "государств", "державн", "украин", "україн"] }], "wrd": ["банк"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["ндекс"] }], "wrd": ["бирж", "бірж"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["дефицит", "дефіцит", "профицит", "профіцит", "сфер", "фективн"] }], "wrd": ["бюджет"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["аг", "стаг", "биф", "деф", "умерен", "помірн", "галоп", "гіпер", "гипер"] }], "wrd": ["фляция", "фляція"], "rl": 3 }, { "ir": [{ "ir": [], "wrd": ["внешн", "зовніш", "внутр", "мвф", "криз"] }], "wrd": ["долг", "борг"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["де", "ре"] }], "wrd": ["вальвац"], "rl": 4 }, { "ir": [], "wrd": ["дивіденд", "дивиденд", "стагнац", "вексель", "волатильн", "дефлятор", "ввп", "внп", "жкх", "хедж", "дериват", "фискал", "фіскал", "офшор", "нвойс"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["випуск", "емісія", "выпуск", "эмисс", "євро", "евро"] }], "wrd": ["облігац", "облигац", "акц"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["пространст", "простір", "новост", "новин", "рецес", "стран", "подел", "рост", "ріст", "ситуац", "национ", "націонал", "сальдо", "прогноз", "показат", "показн", "санкц"] }], "wrd": ["коном"], "rl": 40 }, { "ir": [{ "ir": [], "wrd": ["фонд", "резерв", "запас", "международ", "міжнарод", "мир", "світ"] }], "wrd": ["валют"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["нфляц", "спожив", "потреб", "джонс", "jones", "sp", "коном", "бирж", "бірж", "пааше"] }], "wrd": ["ндекс"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["бумаг", "папер"] }], "wrd": ["ценн", "цінн"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["федерал", "венчур"] }], "wrd": ["фонд"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["международ", "міжнарод", "мвф"] }], "wrd": ["кредит"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["процент", "відсот", "рефинанс", "рефінанс"] }], "wrd": ["ставк"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["устан", "устав", "собств", "власн", "венчур", "привлеч", "залуч", "основн", "оборот", "резерв", "заем"] }], "wrd": ["капитал", "капітал"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["налог", "подат"] }], "wrd": ["льгот", "пільг"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["сальдо", "баланс"] }], "wrd": ["торгов", "торгів"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["билет", "білет", "обязат", "зобовяз", "чейств"] }], "wrd": ["казна"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["продукт", "прибут", "прибыль"] }], "wrd": ["валов"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["возврат", "поверн", "ставк"] }], "wrd": ["пдв", "ндс"], "rl": 40 }, { "ir": [{ "ir": [], "wrd": ["двойн", "подвійн", "добав", "додан", "стоим", "вартіст", "єдин", "един"] }], "wrd": ["налог", "подат"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["нструмент", "бумаг"] }], "wrd": ["производн"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["украин", "україн", "сальдо", "обмеж", "огранич", "квот"] }], "wrd": ["кспорт", "мпорт"], "rl": 20 }], "9227": [{ "ir": [{ "ir": [], "wrd": ["последн", "останн", "криминал", "обществ", "суспіль", "украин", "україн", "мир", "світ", "культур", "медиц", "здоров", "главн", "головн", "лента", "коном", "финанс", "фінанс", "дня", "украин", "україн", "архів", "архив", "портал", "агенств", "популярн", "регион", "интересн", "цікав", "свіж", "свеж", "спорт"] }], "wrd": ["новост", "новин", "вести"], "rl": 60 }, { "ir": [], "wrd": ["дтп", "мітинг", "митинг", "интервью", "інтервю", "погиб", "загинув", "загинули", "пожар", "пожеж", "взрыв", "вибух", "курьез", "курьёз", "курйоз", "интерфакс", "інтерфакс"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["попал", "потрап", "погиб", "жертв", "загуб", "загин", "разруш", "руйнув", "выжи", "вижи", "авиа", "авіа", "нергетич"] }], "wrd": ["авар", "катастроф"], "rl": 40 }, { "ir": [{ "ir": [], "wrd": ["поді", "происшеств"] }], "wrd": ["надзвич", "чрезвыч"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["попередж", "предупрежд"] }], "wrd": ["шторм"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["дня", "украин", "обзор", "огляд"] }], "wrd": ["событи", "поді"], "rl": 20 }], "9483": [{ "ir": [], "wrd": ["технологи", "технологі", "марсоход", "марсохід", "астроном", "изобрет", "винахід", "рационализатор", "раціоналізатор"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["технолог"] }], "wrd": ["новые", "нові", "нан"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["открыт", "відкрит", "новост", "исслед", "дослід", "доказ", "довел", "ксперимент", "сенсац", "обнаруж", "вияви", "выясн", "зясув", "разработ", "розроб", "нашл", "журнал", "технич", "техніч"] }], "wrd": ["наук", "науч", "учены", "вчен", "лаборатор"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["станц", "спутн", "телескоп", "шаттл", "шатл", "ракет"] }], "wrd": ["косм", "орбит", "орбіт"], "rl": 20 }, { "ir": [{ "ir": [], "wrd": ["ген", "созда"] }], "wrd": ["инженер", "інженер"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["нерги"] }], "wrd": ["солнечн", "сонячн"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["интеллект", "інтелект"] }], "wrd": ["искусствен", "штучн"], "rl": 10 }, { "ir": [{ "ir": [], "wrd": ["украин", "україн"] }], "wrd": ["нан"], "rl": 5 }, { "ir": [{ "ir": [], "wrd": ["революц", "прогрес", "потенц"] }], "wrd": ["технич", "техніч"], "rl": 20 }], "9739": [{ "ir": [{ "ir": [], "wrd": ["без"] }], "wrd": ["комплексов", "комплексів"], "rl": 5 }, { "ir": [{ "ir": [], "wrd": ["билдинг", "білдінг"] }], "wrd": ["вум"], "rl": 3 }, { "ir": [], "wrd": ["ерекці", "эрекци", "эроти", "ероти", "знайомств", "знакомств", "интим", "інтим", "контрацеп", "любовник", "любовниц", "коханец", "коханк", "мастурб", "оргазм", "противозачаточн", "протизаплід", "сексуальн", "стриптиз", "соблазнят", "спокушат", "флирт", "флірт", "сексолог", "звабл", "ревност", "тантрич", "либидо", "лібідо"], "rl": 0 }, { "ir": [{ "ir": [], "wrd": ["g"] }], "wrd": ["точка"], "rl": 5 }, { "ir": [{ "ir": [], "wrd": ["романтич", "любов"] }], "wrd": ["отношен", "відносин"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["с", "з"] }], "wrd": ["познакомлюсь", "познакомиться", "познайомлюсь", "познайомитис"], "rl": 3 }, { "ir": [{ "ir": [], "wrd": ["обольщен", "зваблен", "соблазн", "наслажд", "насолод"] }], "wrd": ["секрет", "тайн", "таємн", "способ", "спосіб"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["курорт", "робот"] }], "wrd": ["роман"], "rl": 30 }, { "ir": [{ "ir": [], "wrd": ["жен", "девушк", "муж", "парн"] }], "wrd": ["пикап", "пікап"], "rl": 40 }, { "ir": [{ "ir": [], "wrd": ["секс", "поцелу", "поцілу"] }], "wrd": ["факт"], "rl": 30 }] };
            var host = window.location.hostname;//.split('.').reverse()[1];
            //TODO1: think
            //if (host == 'com' || host == 'org') {
            //     host = window.location.hostname.split('.').reverse()[2];
            //}

            var inArray = function (array, k) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === k) {
                        return true;
                    }
                }
                return false;
            }

            var wordIndexes = {};

            var buildWordIndexes = function (content, word) {
                var res = [];
                var ind = content.indexOf(word);
                while (ind > -1) {
                    res.push(ind);
                    ind = content.indexOf(word, ind + word.length);
                }
                return res;
            }

            var isRuleMatch = function (content, rule) {
                var tmpRes = {};
                tmpRes.matchCount = 0;
                tmpRes.matchingIndexes = [];

                var words = rule.wrd;
                for (var i = 0; i < words.length; i++) {
                    if (words[i].length < 1)
                        continue;
                    var word = words[i];
                    if (wordIndexes[word] == null || wordIndexes[word].length == 0) {
                        wordIndexes[word] = buildWordIndexes(content, word);
                    }
                    var wIndexes = wordIndexes[word];
                    if (wIndexes.length == 0)
                        continue;
                    for (var j = 0; j < wIndexes.length; j++) {
                        if (!inArray(tmpRes.matchingIndexes, wIndexes[j])) {
                            tmpRes.matchCount++;
                            tmpRes.matchingIndexes.push(wIndexes[j]);
                        }
                    }
                }
                if (!tmpRes.matchCount)
                    return tmpRes;
                if (!rule.ir || rule.ir.length == 0)
                    return tmpRes;
                var innerRes = {};
                innerRes.matchingIndexes = [];

                for (var i = 0; i < rule.ir.length; i++) {
                    var innerRule = rule.ir[i];
                    if (!innerRule.wrd)
                        continue;
                    if (!innerRule.rl)
                        innerRule.rl = rule.rl;
                    var irm = isRuleMatch(content, innerRule);
                    if (!irm.matchCount)
                        continue;
                    for (var j = 0; j < irm.matchingIndexes.length; j++) {
                        var cIndex = irm.matchingIndexes[j];
                        if (!inArray(innerRes.matchingIndexes, cIndex))
                            innerRes.matchingIndexes.push(cIndex);
                    }
                }
                var res = {};
                res.matchCount = 0;
                res.matchingIndexes = [];
                for (var i = 0; i < tmpRes.matchingIndexes.length; i++) {
                    var pIndex = tmpRes.matchingIndexes[i];
                    for (var j = 0; j < innerRes.matchingIndexes.length; j++) {
                        var childIndex = innerRes.matchingIndexes[j];
                        var iMatch = (rule.rl) ? (Math.abs(pIndex - childIndex) < rule.rl) : true;
                        if (iMatch) {
                            if (!inArray(res.matchingIndexes, pIndex)) {
                                res.matchingIndexes.push(pIndex);
                                res.matchCount++;
                            }
                        }
                    }
                }
                return res;
            }
            var indexes2 = function (content) {
                wordIndexes = {};
                var res = [];
                for (var cat in categories) {
                    var mRes = [];
                    if (!categories.hasOwnProperty(cat))
                        continue;
                    var sumWeight = 0;
                    for (var rule in categories[cat]) {
                        if (!categories[cat].hasOwnProperty(rule))
                            continue;
                        var mResult = isRuleMatch(content, categories[cat][rule]);
                        if (!mResult.matchCount)
                            continue;
                        var absWeight = mResult.matchCount * 10;
                        sumWeight += absWeight;
                    }
                    if (!sumWeight)
                        continue;
                    res.push({ absWeight: sumWeight, dark: cat });
                }
                return res;
            }

            var buildResult = function (indRes) {
                var maxWeight = 0;
                var res = {};
                res.darksString = '';
                res.sArr = indRes;
                res.dArr = [];

                var maxWeight = 0;
                for (var i = 0; i < indRes.length; i++) {
                    if (indRes[i].absWeight > maxWeight)
                        maxWeight = indRes[i].absWeight;
                }
                var level3 = maxWeight * 0.1;
                for (var i = 0; i < indRes.length; i++) {
                    if (indRes[i].absWeight < 20 || indRes[i].absWeight < level3)
                        continue;
                    res.dArr.push(indRes[i].dark + '-' + indRes[i].absWeight);
                }
                res.darksString = res.dArr.join('_');
                return res;
            }



            var getMeta = function () {
                var keywords = '';
                if (document.title)
                    keywords += document.title;
                var metas = document.getElementsByTagName('meta');
                if (metas) {
                    for (var x = 0, y = metas.length; x < y; x++) {
                        if (metas[x].name.toLowerCase() == "keywords" || metas[x].name.toLowerCase() == "description") {
                            keywords += metas[x].content;
                        }
                    }
                }
                return keywords;
            }


            var getPageContent = function (element) {
                var text = [];
                var self = arguments.callee;
                var el, els = element.childNodes;
                var excluded = {
                    'noscript': 'noscript',
                    'script': 'script',
                    'style': 'style',
                    'select': 'select',
                    'img': 'img'
                };
                for (var i = 0, iLen = els.length; i < iLen; i++) {
                    el = els[i];
                    if (el.nodeType == 1) {
                        var eltg = el.tagName.toLowerCase();
                        var href = '';
                        if (eltg == 'a') {
                            href = el.getAttribute("href");
                        }
                        if (eltg in excluded)
                            continue;
                        text.push(self(el));
                    }
                    else if (el.nodeType == 3) {
                        text.push(el.data);
                    }
                }
                return text.join('');
            }

            var getTagText = function (tagName) {
                var hTags = [];
                var text = [];
                var h1s = document.body.getElementsByTagName(tagName);
                if (h1s && h1s.length) {
                    for (var i = 0; i < h1s.length; i++) {
                        var t = getPageContent(h1s[i]);
                        if (t && t.length)
                            text.push(t);
                    }
                }
                return text.join('');
            }

            var getHeadings = function () {
                var text = [];
                text.push(getTagText('H1'));
                text.push(getTagText('H2'));
                text.push(getTagText('H3'));
                return text.join('');
            }


            p.GetPageCategories = function () {
                var startDate = new Date().getTime();
                try {

                    var meta = getMeta().replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/'/g, '').toLocaleLowerCase();
                    var content = (getPageContent(document.body)).replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/'/g, '').toLowerCase();
                    var isContentTrunc = false;
                    if (content.length > 10000) {
                        content = content.substr(0, 10000);
                        isContentTrunc = true;
                    }

                    if (isContentTrunc) {
                        var hText = getHeadings().replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/'/g, '').toLocaleLowerCase();
                        if (hText && hText.length) {
                            content = hText + content;
                        }
                    }
                    var res = indexes2(meta + content);
                    res = buildResult(res);
                    res.runtime = new Date().getTime() - startDate;
                    return res;
                }
                catch (e) {
                    var res = {};
                    res.runtime = new Date().getTime() - startDate;
                    res.darksString = '';
                    return res;
                }
            }
            p.init();
        })();
        //end plugin adScaner v 1.6


        //PLUGINS END







        //not replacable
        w.admixZArr.__push = w.admixZArr.push;
        w.admixZArr.push = function (arg) {
            w.admixZArr.__push(arg);
            if (!admixerSm.options.showAdsOnLoad || admixerSm.pageLoadState == 1) {
                if (!admixerSm.isStarted)
                    admixerSm.start();
                else {
                    admixerSm.proceedSlots();
                }
            }
        }
        var autoupdv = new Date().getFullYear() + '_' + new Date().getMonth() + '_' + new Date().getDate();
        asm.ensurePlugin('autoUpdate', function () {
            admixerSm.onAutoUpdate();
        }, autoupdv);

        if (admixerSm.options.onLibLoaddedCb) {

            asm.options.onLibLoaddedCb(window.admixerSm);
        }
        var isPageContentLoaded;
        if (/loaded|complete/.test(d.readyState)) {
            isPageContentLoaded = true;
            if (asm.options.showAdsOnLoad)
                admixerSm.onPageLoad();
        }
        else if (d.readyState == 'interactive' && !w.attachEvent) {
            isPageContentLoaded = true;
            if (asm.options.showAdsOnLoad)
                admixerSm.onPageLoad();
        }
        if (!isPageContentLoaded && asm.options.showAdsOnLoad) {
            if (w.attachEvent) {
                w.attachEvent("onload", admixerSm.onPageLoad);
            }
            else if (w.addEventListener) {
                w.addEventListener("DOMContentLoaded", admixerSm.onPageLoad, false);
            }

        }
        setTimeout(function () { admixerSm.onPageLoad() }, 2000);

        
    }
})();