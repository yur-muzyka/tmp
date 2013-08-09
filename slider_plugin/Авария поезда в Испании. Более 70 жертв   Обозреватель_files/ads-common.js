jQuery.fn.outerHTML = function () {
	return $(this).length > 0 ? $(this).clone().wrap('<div />').parent().html() : '';
};

function CreateSWF(attribures) {
	return $('<embed type="application/x-shockwave-flash" quality="best" wmode="opaque" play="true" loop="true" menu="false" allowscriptaccess="always" />').attr(attribures);
}

function InitFlashBanner(obj) {
	var container = $("#" + obj.id);
	var banner = CreateSWF({ src: obj.swf, width: obj.width, height: obj.height, flashvars: "link1=" + encodeURI(obj.link) });
	container.append(banner);
}

function InitTeaser(obj) {
	var index = Math.floor(Math.random() * (obj.items.length));
	var item_to_show = obj.items[index];
	var teaser = $("<a target='_blank'><div><img width='65' height='65'></div><p></p></a>");
	teaser.attr({ 'href': item_to_show.link });
	teaser.find("img").attr({ 'src': obj.img_path + item_to_show.img });
	teaser.find("p").text(item_to_show.title);
	if (item_to_show.view_counter != null && item_to_show.view_counter != '') {
		new Image().src = item_to_show.view_counter + '&r=' + Math.random();
	}
	$('#' + obj.id).append(teaser);
}

function InitOpeningFlashBanner(obj) {

	var banner;
	if(obj.small.img){
		banner = $("<a><img></a>").attr({ href: obj.link });
		banner.find("img").css({ width: obj.small.width, height: obj.small.height }).attr({ src: obj.small.img });
	}else{
		banner = CreateSWF({ src: obj.small.swf, width: obj.small.width, height: obj.small.height, flashvars: "link1=" + encodeURI(obj.link) });
	}
	var banner_large = CreateSWF({ src: obj.large.swf, width: obj.large.width, height: obj.large.height, flashvars: "link1=" + encodeURI(obj.link) });

	var img_large = $('<img src="http://cdn.oboz.ua/css/i/ads/1x1.gif">')
		.css({ width: obj.large.width, height: obj.large.height })
		.wrapAll('<a></a>').parent().attr({ 'href': obj.link, target: '_blank' })
		.css({ position: 'absolute', left: 0, top: 0 });
	
	var container = $("#" + obj.id).css({ position: 'relative', width: obj.small.width, height: obj.small.height });
	container.parent().css({ zIndex: 100, position: 'relative' });

	var div_banner_large = $("<div></div>").css({ position: 'absolute', width: obj.large.width, height: obj.large.height, right: 0, top: 0 }).hide();

	var img_close = $('<img src="http://cdn.oboz.ua/css/i/ads/close.gif">')
		.css({ width: 17, height: 17, position: 'absolute', left: 10, top: 10, cursor: 'pointer' })
		.click(function () { div_banner_large.hide(); });

	div_banner_large
		.append(img_large)
		.append(img_close);

	var div_banner = $("<div></div>")
						.css({ position: 'absolute', width: obj.small.width, height: obj.small.height, right: 0, top: 0 }).append(banner)
						.hover(function () {
							if (!div_banner_large.is(':animated') && div_banner_large.is(':hidden')) {
								div_banner_large.hide();
								div_banner_large.append(banner_large).slideDown();
								setTimeout(function () { div_banner_large.slideUp(); }, obj.show_time);
							}
						});
	container.append(div_banner).append(div_banner_large);
}

function InitOpeningFooterBanner(obj) {
	var params = {
		small:{width:139,height:25},
		large:{width:960,height:200}
	};

	$.extend(true, params, obj);
	
	var banner = CreateSWF({ src: params.small.swf, width: params.small.width, height: params.small.height });
	var banner_large = CreateSWF({ src: params.large.swf, width: params.large.width, height: params.large.height });

	var container = $("#" + params.id).css({ position: 'relative' });
	var container_large = $('#' + container.parent().attr('id') + '_1').hide();

	var img_large = $('<img src="http://cdn.oboz.ua/css/i/ads/1x1.gif">')
		.css({ width: params.large.width, height: params.large.height })
		.wrapAll('<a></a>').parent().attr({ 'href': params.link, target: '_blank' })
		.css({ position: 'absolute', left: 0, top: 0 });

	var img_close = $('<img src="http://cdn.oboz.ua/css/i/ads/close.gif">')
		.css({ width: 17, height: 17, position: 'absolute', right: 10, top: 10, cursor: 'pointer' })
		.click(function () { container_large.hide(); });

	var div =
		banner_large.wrapAll('<div></div>').parent()
			.css({ position: 'relative', width: params.large.width, margin: '0 auto', 'text-align': 'center' })
			.append(img_large)
			.append(img_close)
			.append(banner_large);

	var img = $('<img src="http://cdn.oboz.ua/css/i/ads/1x1.gif">')
		.css({ width: params.small.width, height: params.small.height })
		.wrapAll('<a></a>').parent().attr({ 'href': params.link, target: '_blank' })
		.css({ position: 'absolute', left: 0, top: 0 })
		.hover(function() {
			if (!container_large.is(':animated') && container_large.is(':hidden')) {
				container_large.hide();
				container_large.append(div).slideDown();
				setTimeout(function() { container_large.slideUp(); }, params.show_time);
			}
		});

	container.append(img);
	container.append(banner);
}

var advertNews = {
    posTop: 0,
    posLeft: 0,
    init: function () {
        advertNews.resize();
        $(window).resize(function () {
            advertNews.resize();
        });

        $(".advert-news .cls-ico").click(function () {
            $(".advert-news").hide().addClass("closed");
        });

        // Scroll events
        if ($(".advert-news").is(":visible")) {
            advertNews.getPos();
            advertNews.scroll();
            $(window).scroll(function () {
                advertNews.scroll();
            });
        }
    },
    scroll: function () {
        if (!$(".photo-pop-wrap").is(":visible")) {
            var advertBlock = $(".advert-news");
            if ($(window).scrollTop() + advertBlock.height() + $(".menu-wrap").height() < $("footer").offset().top) {
                if (($(window).scrollTop() > advertBlock.offset().top && !advertBlock.hasClass("advert-fixed")) || advertBlock.hasClass("advert-abs")) {
                    advertBlock.addClass("advert-fixed").css({
                        left: advertNews.posLeft,
                        right: "auto"
                    });
                    if (!advertBlock.hasClass("advert-abs")) {
                        advertBlock.animate({
                            top: $(".menu-wrap").height()
                        }, 450);
                    } else {
                        advertBlock.css("top", $(".menu-wrap").height());
                    }
                    advertBlock.removeClass("advert-abs");
                } else if ($(window).scrollTop() <= advertNews.posTop) {
                    advertBlock.removeClass("advert-fixed").css({
                        right: -advertBlock.outerWidth(),
                        left: "auto",
                        top: 0
                    });
                }
            } else {
                advertBlock.addClass("advert-abs").removeClass("advert-fixed").css({
                    left: "auto",
                    right: -advertBlock.outerWidth(),
                    top: $("footer").offset().top - advertBlock.height() - advertBlock.parent().offset().top
                });
            }
        }
    },
    resize: function () {
        advertNews.getPos();
        advertNews.scroll();
        if ($("body").width() < 1260) {
            $(".advert-news").removeClass("advert-news-visible").addClass("advert-news-hidden");
        } else if (!$(".advert-news").hasClass("closed")) {
            $(".advert-news").removeClass("advert-news-hidden").addClass("advert-news-visible");
            if ($(".advert-news").hasClass("advert-fixed")) {
                $(".advert-news").css("left", advertNews.posLeft);
            } else {
                $(".advert-news").css("left", "auto");
            }
        }
    },
    getPos: function () {
        advertNews.posTop = $(".advert-news").parent().offset().top;
        advertNews.posLeft = $(".advert-news").parent().offset().left + $(".advert-news").parent().outerWidth();
    }
};

function InitRightSlide(obj) {
	var container = $(".advert-news .lst");
	if (container.length == 0) {
		var wrap = $('<div class="advert-news"><div class="wrap"><div class="h3-ttl">Реклама<a class="cls-ico ico png24"></a></div><div class="lst"></div><div class="sep-ln"></div></div></div>');
		$(".cnt-wrap .cntr").prepend(wrap);
		advertNews.init();
		container = $(".advert-news .lst");
	}
	var ads = $("<div></div>").attr({ id: obj.id, class:"item" });
	container.append(ads);
}

function InitBrending(obj) {
	var params = {
		backColor: "#ebecf0",
		backRepeat: "no-repeat"
	};

	$.extend(true, params, obj);

	if (params.height != null) {
		$("body").addClass("brand-page-full");
		$("header").css({ marginBottom: params.height });
	}

	// For full branding add to body two classes: brand-page and brand-page-full
	$("#" + params.id).append("<style>body .rel-news,body .advert-news{display:none}</style>");
	$("body")
		.addClass("brand-page")
		.prepend($("<a class='brand-page-link' target='_blank'/>").attr({ href: params.link }))
		.css({
			backgroundImage: "url(" + params.backImg + ")",
			backgroundColor: params.backColor,
			backgroundRepeat: params.backRepeat,
			backgroundPosition: params.height == null ? "50% 0" : "50% 41px",
			backgroundAttachment: params.height == null ? "fixed" : ""
		});
    if ($("body").hasClass("brand-page") && $(".photo-pop-wrap").is(":visible")) {
        $("body").addClass("brand-page-photo");
    }
}