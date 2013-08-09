//start plugin ib2
(function () {
    var asm = admixerSm;
    var p = admixerSm.ib2;
    var prevBodyScroll = '';
    if (!p) {
        p = {};
        p.initCallbacks = [];
        admixerSm.ib2 = p;
    }
    p.init = function () {
        if (p.isInit)
            return;
        p.isInit = true;
        while (p.initCallbacks.length > 0) {
            p.initCallbacks.pop()(p);
        }
    }

    p.hideScroll = function (isRestore) {
        if (isRestore) {
            document.body.style.overflow = prevBodyScroll;
            return;
        }
        prevBodyScroll = document.body.style.overflow;
        document.body.style.overflow = "hidden";
    }


    p.renderBaner = function (ph, bn, rid, cb) {
        //branding
        if (bn.cr.brandingSettings) {
            var branding = bn.cr.brandingSettings;
            branding.iu = asm.invPath + '/view.aspx?item=' + bn.id + '&requestId=' + rid + '&zone=' + bn.zId;
            if (!asm.options.disableMirror && bn.cr.cdnState == 2)
                branding.iu = asm.mirrorPath + '/creatives/' + bn.cr.id + bn.cr.bannerExtension + '?v=' + bn.cr.dateModifiedTicks;
            branding.cu = asm.invPath + '/click.aspx?item=' + bn.id + '&requestId=' + rid + '&zone=' + bn.zId + '&admguid=' + ph.admixSlot.data.admguid;
            branding.addScript = bn.cr.addScript;
            ph.admixSlot.pageBranding = branding;
        }

        var bid = ph.admixSlot.data.bid;
        var at = bn.cr.adType;
        var st = bn.cr.subType;
        if (!bid || !bid.adm) {
            if (at == 0) {
                if (st == 102 || st == 105) {
                    p.renderLocalFlash(ph, bn, rid, cb);
                }
                else if (st == 101) {
                    p.renderLocalImg(ph, bn, rid, cb);
                }
                else if (st == 110) {
                    var pbn = p.prepareBannerObject(ph, bn, rid);
                    asm.sendPixels(ph, bn, rid, 2);
                    asm.onBannerRendered(window, ph, bn, null);
                }
            }
            else if (at == 1) {
                p.renderExternal(ph, bn, rid, cb);
            }
        }
        else
        {
            p.renderBidAdm(ph, bn, rid, bid, cb);
        }
    }

    p.prepareBannerObject = function (ph, bn, rid) {
        
        var adm_baner = {};
        var iu = asm.invPath + '/view.aspx?item=' + bn.id + '&requestId=' + rid + '&zone=' + bn.zId;
        adm_baner.redirectUrl = asm.invPath + '/click.aspx?item=' + bn.id + '&requestId=' + rid + '&zone=' + bn.zId + '&admguid=' + ph.admixSlot.data.admguid + '&phId=' + ph.id;
        adm_baner.clickUrl = bn.redirectUrl;
        if(!adm_baner.clickUrl)
            adm_baner.clickUrl = adm_baner.redirectUrl;
        if (!asm.options.disableMirror && bn.cr.cdnState == 2)
            iu = asm.mirrorPath + '/creatives/' + bn.cr.id + bn.cr.bannerExtension + '?v=' + bn.cr.dateModifiedTicks;
        adm_baner.bn = bn;
        adm_baner.slot = ph.admixSlot;
        adm_baner.imageUrl = iu;
        adm_baner.itemId = bn.id;
        adm_baner.urlAdmzp = asm.invPath + '/view.aspx?item=' + bn.id + '&zone=' + bn.zId + '&requestId=' + rid;
        adm_baner.width = bn.cr.width;
        adm_baner.height = bn.cr.height;
        adm_baner.zoneId = bn.zId;
        adm_baner.id = "obj" + ph.id;
        adm_baner.afterBannerShown = null;
        adm_baner.html = '';
        adm_baner.title = (bn.cr.altText || '');
        adm_baner.customRender = false;
        adm_baner.phId = ph.id;
        adm_baner.zeroPixel = bn.cr.zeroPixel;
        adm_baner.showCPix = bn.cr.showCPix;
        adm_baner.admExtFrWidth = bn.cr.width;
        adm_baner.mimeType = bn.cr.mimeType;

        if (bn.cr.panels && bn.cr.panels.length > 0) {
            for (var i = 0; i < bn.cr.panels.length; i++) {
                var pnl = bn.cr.panels[i];
                var pnlIndex = bn.cr.panels[i].imageIndex;
                var pnlUrl = '';
                if (!asm.options.disableMirror && pnl.cdnState == 2)
                    pnlUrl = asm.mirrorPath + '/creatives/' + pnl.id + bn.cr.bannerExtension + '?v=' + bn.cr.dateModifiedTicks;
                else
                    pnlUrl = asm.invPath + '/view.aspx?item=' + bn.id + '&zone=' + bn.zId + '&requestId=' + rid + '&index=' + pnlIndex;
                adm_baner['imageUrl_' + pnlIndex] = pnlUrl;
                adm_baner['panel' + pnlIndex + 'width'] = pnl.width;
                adm_baner['panel' + pnlIndex + 'height'] = pnl.height;
                if (i == (bn.cr.panels.length - 1) && ph.admixSlot.pageBranding) ph.admixSlot.pageBranding.iu = pnlUrl;
            }
        }
        adm_baner.addScript = bn.cr.addScript;
        return adm_baner;
    }

    p.renderLocalFlash = function (ph, bn, rid, cb) {
        var adm_baner = p.prepareBannerObject(ph, bn, rid);
        if (adm_baner.addScript) {
            try {
                eval(adm_baner.addScript);
            }
            catch (e) { }
        }
        if (!adm_baner.customRender) {
            var id = ph.id + "_obj";
            ph.innerHTML = '';
            var fd = asm.mediaads2.makeFlashPanel(document, id, adm_baner.width, adm_baner.height, adm_baner.imageUrl, adm_baner.clickUrl);
            if (fd != null) {
                ph.appendChild(fd);
                asm.sendPixels(ph, bn, rid, 2);
                asm.onBannerRendered(window, ph, bn, null);
            }
        }
        else {
            asm.sendPixels(ph, bn, rid, 2);
            asm.onBannerRendered(window, ph, bn, null);
        }
        if (adm_baner.afterBannerShown) {
            adm_baner.afterBannerShown();
        }
    }

    p.renderLocalImg = function (ph, bn, rid, cb) {
        var adm_baner = p.prepareBannerObject(ph, bn, rid);
        if (adm_baner.addScript) {
            try {
                eval(adm_baner.addScript);
            }
            catch (e) { }
        }
        if (!adm_baner.customRender) {
            adm_baner.html += '<a target="_blank" ';
            adm_baner.html += "onclick='admixerSm.trackClick(\"" + adm_baner.redirectUrl + "\", window);return true;'";
            adm_baner.html += 'href="' + adm_baner.clickUrl + '" title="' + adm_baner.title + '">';
            adm_baner.html += '<img src="' + adm_baner.imageUrl + '" border="0" alt="' + adm_baner.title + '" />';
            adm_baner.html += '</a>';
            ph.innerHTML = adm_baner.html;
        }
        asm.sendPixels(ph, bn, rid, 1);
        asm.onBannerRendered(window, ph, bn, null);
        if (adm_baner.afterBannerShown) {
            adm_baner.afterBannerShown();
        }
    }

    p.renderBidAdm = function (ph, bn, rid, bid, cb) {
        var st = bn.cr.subType;
        var adm_baner = p.prepareBannerObject(ph, bn, rid);
        var succ = false;
        try {
            var isIe = !!window.ActiveXObject;
            succ = true;
            adm_baner.admExtFrameScr = asm.invPath + '/framecontent.aspx?item=' + bn.id + '&requestId=' + rid;
            adm_baner.html = '<' + 'iframe width="' + adm_baner.admExtFrWidth + '" height="' + bn.cr.height + '" frameborder="0" allowtransparency="yes"   vspace="0" scrolling="no" hspace="0"><' + '/iframe>';


            ph.innerHTML = adm_baner.html;
            var iF = ph.getElementsByTagName('iframe')[0];
            var content = bid.adm;
            iF.contentWindow.document.write(content);
            iF.contentWindow.admixerSm = asm;
            setTimeout(function () {
                iF.contentWindow.document.close();
            }, 1500);
            succ = true;
            if (cb)
                cb();
        }
        catch (e) { }

        if (succ) {
            asm.onBannerRendered(window, ph, bn);
            asm.trackView(bn, rid, 1);

        }
    }

    p.renderExternal = function (ph, bn, rid, cb) {
        var st = bn.cr.subType;
        var adm_baner = p.prepareBannerObject(ph, bn, rid);
        var succ = false;
        if (st == 201) {
            try {
                var isIe = !!window.ActiveXObject;
                succ = true;
                adm_baner.admExtFrameScr = asm.invPath + '/framecontent.aspx?item=' + bn.id + '&requestId=' + rid;
                adm_baner.html = '<' + 'iframe width="' + adm_baner.admExtFrWidth + '" height="' + bn.cr.height + '" frameborder="0" allowtransparency="yes"   vspace="0" scrolling="no" hspace="0"><' + '/iframe>';


                ph.innerHTML = adm_baner.html;
                var iF = ph.getElementsByTagName('iframe')[0];
                var content = '<!DOCTYPE html><html><head></head><body marginwidth="0" marginheight="0" margin="0" padding="0" style="margin:0px;padding:0px;">';
                content += "<scr" + "ipt>inFIF=true;</scr" + "ipt>";
                content += "<scr" + "ipt>inDapIF=true;</scr" + "ipt>";
                content += bn.cr.HTML;
                content += '</body></html>';
                iF.contentWindow.document.write(content);
                iF.contentWindow.admixerSm = asm;
                setTimeout(function () {
                    iF.contentWindow.document.close();
                }, 500);
                succ = true;
                if (cb)
                    cb();
            }
            catch (e) { }

            if (succ) {
                asm.onBannerRendered(window, ph, bn);
                if (bn.cr.showCPix) {
                    var vt = 1;
                    if (adm_baner.mimeType == "application/x-shockwave-flash")
                        vt = 2;
                    asm.trackView(bn, rid, vt);

                }
            }
        }
        else if (st == 203) {
            var succ = false;
            try {
                var adm_banner = adm_baner;
                adm_banner.ph = ph;
                eval(bn.cr.HTML);

                succ = true;
            }
            catch (e) { }
            if (succ && bn.cr.showCPix) {
                if (adm_baner.mimeType == "application/x-shockwave-flash")
                    vt = 2;
                asm.trackView(bn, rid, vt);
                asm.onBannerRendered(window, ph, bn, null);
                if (cb)
                    cb();
            }
        }
        else if (st == 202) {
            var pName = 'wc';
            if (bn.cr.isWc2)
                pName = 'wc2';
            asm.ensurePlugin('wc', function (wc) {
                try {
                    wc.inject(ph, bn.cr.HTML);
                    succ = true;
                }
                catch (e) { }
                finally { }
                if (succ && bn.cr.showCPix) {
                    if (adm_baner.mimeType == "application/x-shockwave-flash")
                        vt = 2;
                    asm.trackView(bn, rid, vt);
                    asm.onBannerRendered(window, ph, bn, null);
                    if (cb)
                        cb();
                }
            });
        }
    }
    p.init();
})();
//end plugin ib2

(function () {
    var p = admixerSm.mediaads2;
    var asm = admixerSm;

    p.init = function () {
        if (p.isInit)
            return;
        p.isInit = true;
        while (p.initCallbacks.length > 0) {
            p.initCallbacks.pop()(p);
        }
    }
    p.fillSlot = function (slot, slotData, rCallback) {
        if (slotData.items.length == 0) {
            //no items
            rCallback();
            return;
        }
        var bn = null;
        for (var i = 0; i < slotData.items.length; i++) {
            var bn = slotData.items[i];
            bn.zId = slotData.zId;
            bn.ts = (slotData.ts || 0);
            bn.sg = (slotData.sg || 0);
            bn.cnt = (slotData.cnt || 'unk');
        }
        bn = slotData.items[0];
        bn.zId = slotData.zId;
        bn.ts = (slotData.ts || 0);
        bn.sg = (slotData.sg || 0);
        bn.cnt = (slotData.cnt || 'unk');
        var rid = slotData.requestId;
        var at = bn.cr.adType;
        var st = bn.cr.subType;
        if (at <= 2) {
            if (st == 106) {
                asm.ensurePlugin('preroll', function (p) {
                    p.renderBaner(slot, bn, rid, rCallback);
                });
            }
            else {
                asm.ensurePlugin('ib2', function (p) {
                    p.renderBaner(slot.ph, bn, rid, rCallback);
                });
            }
        }
        else if (at == 5) {
            asm.ensurePlugin('controll', function (p) {
                p.renderBaner(slot, bn, rid, rCallback);
            });
        }
        else if (at == 6) {
            asm.ensurePlugin('fsroll', function (p) {
                p.renderBaner(slot, bn, rid, rCallback);
            });
        }
        else if (at == 7) {
            asm.ensurePlugin('vi', function (p) {
                p.renderBaner(slot, bn, rid, rCallback);
            });
        }
        else if (at == 4) {

            if (st == 401) {
                asm.ensurePlugin('localRm', function (p) {
                    p.renderBaner(slot.ph, bn, rid, rCallback);
                });
            }
            else if (st == 402) {
                var pName = 'wc';
                if (bn.cr.isWc2)
                    pName = 'wc2';
                asm.ensurePlugin(pName, function (wc) {
                    var succ = false;
                    try {
                        wc.inject(slot.ph, bn.cr.HTML);
                        succ = true;

                    }
                    catch (e) { }
                    finally { }
                    if (succ) {
                        asm.trackView(bn, rid, 2);
                        asm.onBannerRendered(window, slot.ph, bn, null);
                        if (rCallback)
                            rCallback();
                    }
                });
            }
            else if (st == 403) {
                var succ = false;
                try {
                    var adm_banner = {};
                    adm_banner.ph = slot.ph;
                    eval(bn.cr.HTML);
                    succ = true;
                }
                catch (e) {
                }
                if (succ) {
                    asm.trackView(bn, rid, 2);
                    asm.onBannerRendered(window, slot.ph, bn, null);
                    if (rCallback)
                        rCallback();
                }
            }
        }

    }

    asm.expand = function (href, opts, wnd) {
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
            ph = asm.hostWindow.document.getElementById(phId);
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
        if (slot && !slot.isExpanded) {
            slot.isExpanded = true;
            if (wnd != asm.hostWindow) {
                var frm = wnd.frameElement;
                var fWidth = frm.offsetWidth;
                var fHeight = frm.offsetHeight;
                if (opts.left) {
                    fWidth += opts.left;
                    if (opts.static) { }
                    else
                        frm.style.position = 'relative';
                    frm.style.left = '0px';
                    frm.style.left = '-' + opts.left + 'px';
                    frm.style.width = fWidth + 'px';
                }
                if (opts.bottom) {
                    fHeight += opts.bottom;
                    if (opts.static) { }
                    else
                        frm.style.position = 'relative';
                    frm.style.height = fHeight + 'px';
                }
            }
            asm.callExt('onAdExpanded', slot, bn, opts);
        }
    }

    asm.collapse = function (href, opts, wnd) {
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
            ph = asm.hostWindow.document.getElementById(phId);
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
        if (slot && slot.isExpanded) {
            slot.isExpanded = false;
            if (wnd != asm.hostWindow) {
                var frm = wnd.frameElement;
                var fWidth = frm.offsetWidth;
                var fHeight = frm.offsetHeight;
                frm.style.left = '0px';
                frm.style.width = bn.cr.width + 'px';
                frm.style.height = bn.cr.height + 'px';
                frm.style.position = 'static';

            }
            asm.callExt('onAdCollapsed', slot, bn, opts);
        }
    }

    p.makeFlashPanel = function (doc, id, width, height, imageUrl, clickUrl, params) {
        var fullUrl = imageUrl;
        var escapedClick = asm.encodeUrl(clickUrl);
        if (fullUrl.indexOf('?') > 0)
            fullUrl += '&';
        else
            fullUrl += '?';
        fullUrl += 'clickTag=' + escapedClick + '&link1=' + escapedClick;

        var html = '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';
        html += ' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" id="' + id + '" NAME="movie' + id + '"';
        if (width)
            html += ' WIDTH="' + width + '"';
        if(height)
            html += ' HEIGHT="' + height + '" ';
        html += '>';
        html += '<PARAM NAME="movie" VALUE="' + fullUrl + '" />';
        html += '<PARAM NAME=wmode VALUE="transparent" />';
        html += '<PARAM NAME="allowScriptAccess" VALUE="always" />';
        html += '<EMBED allowScriptAccess="always" wmode="transparent" NAME="' + id + '" id="' + id + '" ';
        html += 'src="' + fullUrl + '" ';
        if(width)
            html += ' width="' + width + '"';
        if(height)
            html += ' height="' + height + '"';
        html += ' type="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">';
        html += '</EMBED></OBJECT>';
        if (asm.debugMode)
            html += '<div style="position:relative;left:0px;top:-10px;background-color:#efefef;width:10px;height:10px;z-Index:99999;"> </div>';
        var div = doc.createElement('DIV');
        div.innerHTML = html;
        return div;
    }
    p.init();
})();