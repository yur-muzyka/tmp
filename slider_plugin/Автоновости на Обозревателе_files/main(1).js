$("footer .soc-blk").before('<div class="partner-logo" id="zone_133"></div>');
$("footer").before('<div id="zone_133_1"></div>');
if($("article").length){
   InitRightSlide({id:"zone_134"});
}
if($("article").length){
   InitRightSlide({id:"zone_135"});
}
$('body').append('<div id="zone_137"></div>')
$('.article-txt').after('<div id="zone_138"></div>')
$('.article-txt').after('<div id="zone_139"></div>')
$('body').append('<div id="zone_140"></div>')
$('.article-txt').after('<div class="banner-cnt" id="zone_141"></div>');
if(!/\/testdrive\//gi.test(location.pathname)){
   $('header').after('<div class="banner-h" id="zone_142"></div>');
}
if($('.r-col').length==2){
$('.r-col:last').prepend('<div class="banner-300x250" id="zone_143"></div>');
}else{
$('.r-col:first .audio-wrap').after('<div class="banner-300x250" id="zone_143"></div>');
}
if($("article").length){
   InitRightSlide({id:"zone_353"});
}
if($("article").length){
   InitRightSlide({id:"zone_354"});
}
if(/\/testdrive\//gi.test(location.pathname)){
   $('header').after('<div class="banner-h" id="zone_355"></div>');
}
