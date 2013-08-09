
(function () {
    var p = admixerSm.fsroll;
    var asm = admixerSm;

    p.init = function () {
        if (p.isInit)
            return;
        p.isInit = true;
        while (p.initCallbacks.length > 0) {
            p.initCallbacks.pop()(p);
        }
    }
    p.renderBaner = function (slot, bn, rCallback) {
        if (admixerSm.hasActiveVideoPlayer) {
            admixerSm.viedoAdsCbs = (admixerSm.viedoAdsCbs || []);
            admixerSm.viedoAdsCbs.push(function () {
                admixerSm.fsroll.onPreInitDone(slot);
            });
            return;
        }
        admixerSm.hasActiveVideoPlayer = true;
        admixerSm.hasActiveVideoPlayer = true;
        if (!window.flowplayer) {
            asm.loadScript(asm.cdnPath + '/scriptlib/video/flowplayer/flowplayer-3.2.9.min.js?v=' + asm.version, function () {
                admixerSm.fsroll.onPreInitDone(slot, rCallback);
            });
        }
        else {
            admixerSm.fsroll.onPreInitDone(slot, rCallback);
        }
    }


    p.trackView = function (slot, evTypeName) {

        if (!slot.videStartTime || slot.videStartTime <= 0 || slot.isViewTracked)
            return;
        var duration = new Date().getTime() - slot.videStartTime;
        var bn = slot.data.items[0];
        var cr = bn.cr;
        var duration = new Date().getTime() - slot.videStartTime;
        var rid = slot.data.requestId;
        if (!cr.vAs)
            cr.vAs = 1;

        if (!p.areExtPixelsWasSend) {
            p.areExtPixelsWasSend = true;
            if (cr.i_zps && cr.i_zps.length > 0) {
                var zps = cr.i_zps.split(' ');
                for (i = 0; i < zps.length; i++) {
                    p.trackAction(zps[i]);
                }
            }
            else if (cr.zeroPixel)
                p.trackAction(cr.zeroPixel);
        }
        if (duration >= (cr.vAs * 1000)) {
            slot.isViewTracked = true;
            var u = asm.invPath + '/view.aspx?item=' + bn.id + '&requestId=' + rid + '&zone=' + bn.zId + '&pvvt=1' + '&admguid=' + slot.data.admguid;
            if (evTypeName != null)
                u += '&evtn=' + evTypeName;
            p.trackAction(u);
            var tagUrl = asm.invPath + '/view.aspx?zone=' + slot.data.zId + '&item=' + slot.data.items[0].id + '&admguid=' + slot.data.admguid + '&requestId=' + slot.data.requestId + '&rnd=' + new Date().getTime();
            p.trackAction(tagUrl);
            p.trackAction(u);
           
        }
    }


    p.onVideoAdFinished = function (slot) {
        var ph = slot.ph;
        var rid = slot.data.requestId;
        if (!ph.admixSlot.videStartTime || ph.admixSlot.videStartTime <= 0)
            return;
        var duration = new Date().getTime() - ph.admixSlot.videStartTime;
        var bn = ph.admixSlot.data.items[0];
        var cr = bn.cr;
        ph.admixSlot.videStartTime = 0;
        p.trackView(slot);
        duration = duration = (duration / 1000) - 1;
        if (duration > 0) {
            p.trackView(slot);
            var u = asm.invPath + '/view.aspx?item=' + bn.id + '&requestId=' + rid + '&zone=' + bn.zId + '&pvvt=1&type=12&val=' + duration + '&admguid=' + slot.data.admguid;
            p.trackAction(u);
        }
        admixerSm.hasActiveVideoPlayer = false;
        setTimeout(function () {
            if (admixerSm.viedoAdsCbs && admixerSm.viedoAdsCbs.length > 0) {
                var cb = admixerSm.viedoAdsCbs.pop();
                try {
                    cb();
                }
                catch (e) { }
            }
        }, 1);
    }

    p.trackAction = function (u) {
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
        if (document.body)
            document.body.appendChild(a_zp);
        else
            document.documentElement.appendChild(a_zp);
    }
    p.onPreInitDone = function (slot, rCallback) {
        var asm = window.admixerSm;
        asm.hasActiveVideoPlayer = true;
        var ph = slot.ph;
        var cr = slot.data.items[0].cr;
        var bn = slot.data.items[0];
        var rid = slot.data.requestId;
        ph.innerHTML = '<table border="0" width="100%" style="zIndex:20000000;background-color: rgba(220, 220, 220, 0.5);"><tr><td align="center" width="100%" style="vertical-align:middle;text-align:center;"><center><table cellspacing="0" cellpadding="0" border="0"><tr><td width="550"></td>&nbsp;<td width="30" align="right" style="text-align:right;"><a style="cursor:pointer;" title="Закрыть" id="btnc_' + ph.id + '" ><img width=30 src="' + asm.cdnPath + '/scriptlib/video/flowplayer/close.png"/></a></td></tr><tr><td colspan="2"><div align="center" id="fp_' + ph.id + '" style="width:580px;height:333px;"></div></td></tr></table></center></td><td></td></tr></table>';
        ph.style.width = '1px';
        ph.style.height = '1px';
        ph.style.overflow = 'hidden';
        var slot = ph.admixSlot;
        var panel = null;
        if (cr.panels && cr.panels.length > 0) {
            panel = cr.panels[0];
            var iu = asm.invPath + '/view.aspx?item=' + bn.id + '&requestId=' + rid + '&zone=' + bn.zId + '&noconfirm=1&index=' + panel.imageIndex;
            if (!asm.options.disableMirror && bn.cr.cdnState == 2)
                iu = asm.mirrorPath + '/creatives/' + panel.id + panel.bannerExtension + '?v=' + bn.cr.dateModifiedTicks;
            var tbl = ph.getElementsByTagName('TABLE')[0];
            ph.style.backgroundImage = 'url("' + iu + '")';
            ph.style.cssText += 'background-size:2560px 1000px; background-repeat:no-repeat; background-position:50% 50%;';

            /*var bckImg = document.createElement('img');
            bckImg.style.position = 'absolute';
            bckImg.style.maxWidth = '100%';
            bckImg.style.height = '100%';
            bckImg.style.left = '0';
            bckImg.style.top = '0';
            bckImg.style.zIndex = '20000000';
            bckImg.src = iu;
            ph.appendChild(bckImg);*/
            //ph.style.backgroundAttachment = 'fixed';
        }
        var tagUrl = asm.invPath + '/AdVideoXml.aspx?zone=' + slot.data.zId + '__amp__creativeExt=flv__amp__item=' + slot.data.items[0].id + '__amp__phId=' + ph.id + '__amp__admguid=' + slot.data.admguid + '__amp__noconfirm=1__amp__isnlvd=1__amp__requestId=' + slot.data.requestId;



        window.onTrackingEvent = function (event) {
            if (event != null && event.eventType) {
                var asm = window.admixerSm;
                if (event.urls && event.urls.length > 0) {
                    var u = event.urls[0].url.toLowerCase();
                    var qs = u.split('?')[1].split('&');
                    var rid = '';
                    for (var i = 0; i < qs.length; i++) {
                        if (qs[i].indexOf('requestid') == 0) {
                            rid = qs[i].split('=')[1];
                            continue;
                        }
                        if (qs[i].indexOf('phid') == 0) {
                            var ph = document.getElementById(qs[i].split('=')[1]);
                            if (ph && ph.admixSlot) {
                                if (rid.length > 0)
                                    ph.admixSlot.data.requestId = rid;
                                if (event.eventType == 'start') {
                                    ph.admixSlot.videStartTime = new Date().getTime();
                                }
                                else if (event.eventType == 'complete') {
                                    admixerSm.controll.onVideoAdFinished(slot);
                                }
                                else {
                                    p.trackView(ph.admixSlot, event.eventType);
                                }
                            }
                        }
                    }
                }
            }
        }
        var ovaDaef = {
            url: asm.cdnPath + "/scriptlib/video/ova.swf?rnd=" + asm.version,
            autoPlay: false,
            canFireEventAPICalls: true,
            regions: {
                declarations: [
                {
                    id: "my-ad-notice",
                    verticalAlign: "top",
                    horizontalAlign: "left",
                    backgroundColor: "transparent",
                    width: "100pct",
                    height: 40,
                    style: ".smalltext { font-style: italic; font-size:10; }"
                }
                ]
            },
            ads: {
                pauseOnClickThrough: true,
                controls: {
                    //skipAd: {
                    // enabled: true,
                    // showAfterSeconds: 1,
                    // "html": "<p>Закрыть X</p>",
                    // "region": {
                    // "id": "my-new-skip-ad-button",
                    // "backgroundColor": "#CACACA",
                    // "opacity": 0.8,
                    // "borderRadius": 15,
                    // "padding": "0 1 1 13",
                    // "width": 90,
                    // "height": 20
                    // }
                    //}
                },
                schedule: [
                {
                    position: "pre-roll",
                    "server": { tag: tagUrl },
                    notice: {
                        show: true,
                        region: "my-ad-notice",
                        message: "Осталось _countdown_ секунд"
                    }
                }
                ],
                clickSign:
                {
                    enabled: "true",
                    verticalAlign: "center",
                    horizontalAlign: "center",
                    width: 250,
                    height: 30,
                    opacity: 1,
                    borderRadius: 20,
                    backgroundColor: "transparent",
                    style: "font-size:16px;",
                    html: "Перейти на сайт рекламодателя",
                    scaleRate: 0.75
                }
            }
        }
        var controlsDef = null;
        var contentDef = null;
        var showContCOntrol = true;
        if (cr.isWithSound) {
            controlsDef = {
                tooltips: null,
                all: false,
                play: false,
                volume: false,
                mute: true,
                slowForward: false,
                fullscreen: true,
                opacity: 1,
                autoHide: "never",
                backgroundGradient: 'none',
                backgroundColor: 'transparent',
                callType: 'default',
                right: 20,
                width: 50
            };
        }
        else {
            contentDef = {
                url: 'flowplayer.content-3.2.8.swf',
                top: 70,
                left: 250,
                width: 180,
                height: 180,
                zIndex: 2000000000,
                backgroundGradient: 'none',
                backgroundColor: 'transparent',
                border: '0px solid rgba(220, 220, 220, 0.8)',
                borderRadius: 0,
                backgroundImage: 'url(' + asm.cdnPath + '/scriptlib/video/flowplayer/sound1.png)',
                style: {
                    '.title': {
                        'fontSize': 18,
                        'fontFamily': 'arial,verdana,helvetica',
                        'textAlign': 'left',
                        'color': '#ffffff',
                        'disply': 'block',
                        'marginLeft': '-40px'
                    }
                },
                html: '<a href="javascript:void(0);"><p class="title"><br/><br/><br/><br/><br/>Включить звук</p></a>',
                onClick: function () {
                    this.hide();
                    $f().unmute();
                    return false;
                }
            };
        }
        var fp = flowplayer('fp_' + ph.id, asm.cdnPath + "/scriptlib/video/flowplayer/flowplayer-3.2.10.swf?v=" + asm.version, {
            clip: {
                url: asm.mirrorPath + "/scriptlib/video/pix1.flv",
                //autoPlay: true,
                scaling: 'orig',
                //autoBuffering: true,
                duration: 10,
                onStart: function () {
                    if (!slot.player_started) {
                        admixerSm.ib2.hideScroll();
                        slot.player_started = true;
                        ph.style.position = 'fixed';
                        ph.style.height = '100%';
                        ph.style.zIndex = 200000000;
                        ph.style.left = '0px';
                        ph.style.top = '0px';
                        ph.style.width = '100%';
                        if (panel) {
                            var tbl = ph.getElementsByTagName('TABLE')[0];
                            //ph.style.backgroundImage = 'url("' + iu + '")';
                            tbl.style.backgroundColor = '';
                            tbl.style.left = '0px';
                            tbl.style.height = '100%';
                            tbl.style.zIndex = 2000000000;
                            tbl.style.top = '10%';//parseInt((window.innerHeight - 333) / 2) + 'px';
                            //tbl.style.position = 'fixed';
                            
                        }
                        var cHeight = document.body.clientHeight;
                        //cHeight + 'px';
                        //tbl.style.marginTop =
                        if (cr.isWithSound)
                            this.unmute();
                        else
                            this.mute();
                    }
                },
                onFinish: function () {
                    
                    admixerSm.fsroll.onVideoAdFinished(slot);
                    var bn = slot.data.items[0]
                    var cr = bn.cr;
                    var ph = slot.ph;
                    var rid = slot.data.requestId;
                    var asm = window.admixerSm;
                    ph.style.width = '0px';
                    ph.style.height = '0px';
                    ph.style.display = 'none';
                    var tbl = ph.getElementsByTagName('TABLE')[0];
                    tbl.style.display = 'none';
                    ph.innerHTML = '';
                    admixerSm.ib2.hideScroll(true);
                }
            },
            plugins: {
                controls: controlsDef,
                ova: ovaDaef,
                myContent: contentDef
            }
        }
        );
        
        var btnc = document.getElementById('btnc_' + ph.id);
        if (window.addEventListener) {
            btnc.addEventListener("click", function () { return p.onAdClosed(slot); }, false);
        }
        else {
            btnc.onclick = function () {
                p.onAdClosed(slot);
            }
        }

        slot.player = fp;
        fp.play(0);
    }
    p.onAdClosed = function (slot) {
        admixerSm.fsroll.onVideoAdFinished(slot);
        var bn = slot.data.items[0]
        var cr = bn.cr;
        var ph = slot.ph;
        var rid = slot.data.requestId;
        var asm = window.admixerSm;
        ph.style.width = '0px';
        ph.style.height = '0px';
        ph.innerHTML = '';
        admixerSm.ib2.hideScroll(true);
        return false;
    }
    p.init();
})();


