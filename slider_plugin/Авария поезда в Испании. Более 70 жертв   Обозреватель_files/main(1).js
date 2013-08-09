if($("article").length){
   InitRightSlide({id:"zone_255"});
}
if($("article").length){
   InitRightSlide({id:"zone_256"});
}
if(location.pathname.toLowerCase() != '/' && location.pathname.toLowerCase() != '/main.htm'){
   $('header').after('<div class="banner-h" id="zone_257"></div>');
}
$('.article-txt').after('<div id="zone_258"></div>')
$('.article-txt').after('<div id="zone_259"></div>')
if(
!/\/politics\//gi.test(location.pathname) &&
!/\/abroad\//gi.test(location.pathname) &&
!/\/culture\//gi.test(location.pathname) &&
!/\/crime\//gi.test(location.pathname) &&
location.pathname.toLowerCase() != '/' && location.pathname.toLowerCase() != '/main.htm'
)
{
   $('body').append('<div id="zone_260"></div>');
}
$('body').append('<div id="zone_261"></div>')
if(location.pathname.toLowerCase() == '/' || location.pathname.toLowerCase() == '/main.htm'){
   $('.audio-wrap').after('<div class="banner-300x250" id="zone_262"></div>');
}
$("footer .soc-blk").before('<div class="partner-logo" id="zone_263"></div>');
$("footer").before('<div id="zone_263_1"></div>');
$('.article-txt').after('<div class="banner-cnt" id="zone_264"></div>');
if(/\/crime\//gi.test(location.pathname))
{
   $('body').append('<div id="zone_265"></div>');
}
if(/\/abroad\//gi.test(location.pathname))
{
   $('body').append('<div id="zone_266"></div>');
}
if(/\/culture\//gi.test(location.pathname))
{
   $('body').append('<div id="zone_267"></div>');
}
if(location.pathname.toLowerCase() != '/' && location.pathname.toLowerCase() != '/main.htm'){
if($('.r-col').length==2){
   $('.r-col:last').prepend('<div class="banner-300x250" id="zone_268"></div>');
}else{
   $('.r-col:first .audio-wrap').after('<div class="banner-300x250" id="zone_268"></div>');
}
}
if(location.pathname.toLowerCase() == '/' || location.pathname.toLowerCase() == '/main.htm'){
   $('header').after('<div class="banner-h" id="zone_269"></div>');
}
if(location.pathname.toLowerCase() == '/' || location.pathname.toLowerCase() == '/main.htm'){
   $('.tabs-news-wrap:last').before('<div id="zone_315" class="banner-300x250"></div>');
}
$('.important-and-popular').after('<div id="zone_316" class="banner-300x250"></div>');
if($("article").length){
   InitRightSlide({id:"zone_331"});
}
if($("article").length){
   InitRightSlide({id:"zone_332"});
}
