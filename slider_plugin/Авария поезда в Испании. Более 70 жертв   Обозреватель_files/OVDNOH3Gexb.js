/*!CK:2133971854!*//*1375688402,173205835*/

if (self.CavalryLogger) { CavalryLogger.start_js(["N1l+V"]); }

__d("legacy:fbdesktop-detect",["FBDesktopDetect"],function(a,b,c,d){a.FbDesktopDetect=b('FBDesktopDetect');},3);
__d("detect_broken_proxy_cache",["AsyncSignal","Cookie","URI"],function(a,b,c,d,e,f){var g=b('AsyncSignal'),h=b('Cookie'),i=b('URI');function j(k,l){var m=h.get(l);if((m!=k)&&(m!=null)&&(k!='0')){var n={c:'si_detect_broken_proxy_cache',m:l+' '+k+' '+m},o=new i('/common/scribe_endpoint.php').getQualifiedURI().toString();new g(o,n).send();}}e.exports=j;});
__d("legacy:detect-broken-proxy-cache",["detect_broken_proxy_cache"],function(a,b,c,d){a.detect_broken_proxy_cache=b('detect_broken_proxy_cache');},3);
__d("IntlUtils",["AsyncRequest","Cookie","goURI"],function(a,b,c,d,e,f){var g=b('AsyncRequest'),h=b('Cookie'),i=b('goURI'),j={setXmode:function(k){(new g()).setURI('/ajax/intl/save_xmode.php').setData({xmode:k}).setHandler(function(){document.location.reload();}).send();},setAmode:function(k){new g().setURI('/ajax/intl/save_xmode.php').setData({amode:k,app:false}).setHandler(function(){document.location.reload();}).send();},setLocale:function(k,l,m,n){if(!m)m=k.options[k.selectedIndex].value;j.saveLocale(m,true,null,l,n);},saveLocale:function(k,l,m,n,o){new g().setURI('/ajax/intl/save_locale.php').setData({aloc:k,source:n,app_only:o}).setHandler(function(p){if(l){document.location.reload();}else i(m);}).send();},setLocaleCookie:function(k,l){h.set('locale',k,7*24*3600000);i(l);}};e.exports=j;});
__d("legacy:intl-base",["IntlUtils"],function(a,b,c,d){var e=b('IntlUtils');a.intl_set_xmode=e.setXmode;a.intl_set_amode=e.setAmode;a.intl_set_locale=e.setLocale;a.intl_save_locale=e.saveLocale;a.intl_set_cookie_locale=e.setLocaleCookie;},3);
__d("link_rel_preload",["Bootloader","Parent"],function(a,b,c,d,e,f){var g=b('Bootloader'),h=b('Parent');function i(){var j=/async(?:-post)?|dialog(?:-pipe|-post)?|theater|toggle/;document.documentElement.onmousedown=function(k){k=k||window.event;var l=k.target||k.srcElement,m=h.byTag(l,'A');if(!m)return;var n=m.getAttribute('ajaxify'),o=m.href,p=n||o;if(n&&o&&!(/#$/).test(o)){var q=k.which&&k.which!=1,r=k.altKey||k.ctrlKey||k.metaKey||k.shiftKey;if(q||r)return;}var s=m.rel&&m.rel.match(j);s=s&&s[0];switch(s){case 'dialog':case 'dialog-post':g.loadModules(['Dialog']);break;case 'dialog-pipe':g.loadModules(['AjaxPipeRequest','Dialog']);break;case 'async':case 'async-post':g.loadModules(['AsyncRequest']);break;case 'theater':g.loadModules(['PhotoSnowlift'],function(t){t.preload(p,m);});break;case 'toggle':g.loadModules(['Toggler']);break;}return;};}e.exports=i;});
__d("legacy:link-rel-preload",["link_rel_preload"],function(a,b,c,d){a.link_rel_preload=b('link_rel_preload');},3);
__d("legacy:async",["AsyncRequest","AsyncResponse"],function(a,b,c,d){a.AsyncRequest=b('AsyncRequest');a.AsyncResponse=b('AsyncResponse');},3);
__d("LoginFormController",["Event","ge","Button"],function(a,b,c,d,e,f){var g=b('Event'),h=b('ge'),i=b('Button');f.init=function(j,k){g.listen(j,'submit',function(){i.setEnabled(k,false);i.setEnabled.curry(k,true).defer(15000);});var l=h('lgnjs');if(l)l.value=parseInt(Date.now()/1000,10);};});
__d("BanzaiNectar",["Banzai"],function(a,b,c,d,e,f){var g=b('Banzai');function h(j){return {log:function(k,l,m){var n={e:l,a:m};g.post('nectar:'+k,n,j);}};}var i=h();i.create=h;e.exports=i;});
__d("DimensionLogging",["BanzaiNectar","DOMDimensions"],function(a,b,c,d,e,f){var g=b('BanzaiNectar'),h=b('DOMDimensions'),i=h.getViewportDimensions();g.log('browser_dimension','homeload',{x:i.width,y:i.height,sw:window.screen.width,sh:window.screen.height,aw:window.screen.availWidth,ah:window.screen.availHeight,at:window.screen.availTop,al:window.screen.availLeft});});
__d("DimensionTracking",["Cookie","DOMDimensions","Event","debounce","isInIframe"],function(a,b,c,d,e,f){var g=b('Cookie'),h=b('DOMDimensions'),i=b('Event'),j=b('debounce'),k=b('isInIframe');function l(){var m=h.getViewportDimensions();g.set('wd',m.width+'x'+m.height);}if(!k()){l.defer(100);i.listen(window,'resize',j(l,250));i.listen(window,'focus',l);}});
__d("HighContrastMode",["AsyncSignal","Cookie","CSS","DOM","Env","Style","emptyFunction"],function(a,b,c,d,e,f){var g=b('AsyncSignal'),h=b('Cookie'),i=b('CSS'),j=b('DOM'),k=b('Env'),l=b('Style'),m=b('emptyFunction'),n={init:function(o){var p=j.create('div');j.appendContent(document.body,p);p.style.cssText='border: 1px solid;'+'border-color: red green;'+'position: fixed;'+'height: 5px;'+'top: -999px;'+'background-image: url('+o.spacerImage+');';var q=l.get(p,'background-image'),r=l.get(p,'border-top-color'),s=l.get(p,'border-right-color'),t=r==s||(q&&(q=='none'||q=='url(invalid-url:)'));if(t!==o.isHCM){i.conditionClass(document.documentElement,'highContrast',t);if(k.user){h.set('highContrastMode',t?'true':'false');if(t)new g('/ajax/highcontrast').send();}}j.remove(p);n.init=m;}};e.exports=n;});
function tz_calculate(a){var b=new Date(),c=b.getTimezoneOffset()/30,d=b.getTime()/1000,e=Math.round((a-d)/1800),f=Math.round(c+e)%48;if(f==0){return 0;}else if(f>24){f-=Math.ceil(f/48)*48;}else if(f<-28)f+=Math.ceil(f/-48)*48;return f*30;}function tz_autoset(a,b,c){if(!a||undefined==b)return;if(window.tz_autoset.calculated)return;window.tz_autoset.calculated=true;var d=-tz_calculate(a);if(c||d!=b){var e='/ajax/timezone/update.php';new AsyncRequest().setURI(e).setData({gmt_off:d,is_forced:c}).setErrorHandler(emptyFunction).setTransportErrorHandler(emptyFunction).setOption('suppressErrorAlerts',true).send();}}