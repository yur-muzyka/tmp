$.fn.slideShow = function (params) {
    params = $.extend({
        autoplay: false,
        delay: 0,
        interval: 3000
    }, params);

    var _slide = {
        pos: 0,
        timeOut: null,
        wrap: null,
        next: function () {
            var pos = _slide.pos == (_slide.wrap.find(".slide-nav li").length - 1) ? 0 : _slide.pos + 1;
            _slide.show(pos);
        },
        click: function (i) {
            _slide.pos = i;
            _slide.wrap.find(".slide-nav li").removeClass("cur");
            _slide.wrap.find(".slide-nav li[value=" + i + "]").addClass("cur");
            _slide.wrap.find(".slide-lst").each(function () {
                $(this).find("li:first").before($(this).find("li[value=" + i + "]"));
            });
        },
        show: function (i) {
            _slide.pos = i;
            _slide.wrap.find(".slide-nav li").removeClass("cur");
            _slide.wrap.find(".slide-nav li[value=" + i + "]").addClass("cur");
            _slide.wrap.find(".slide-lst-clone").stop(true).fadeOut(function () {
                _slide.wrap.find(".slide-lst-clone li:first").before(_slide.wrap.find(".slide-lst-clone li[value=" + i + "]"));
                $(this).show();
            });
            _slide.wrap.find(".slide-lst:first li:first").before(_slide.wrap.find(".slide-lst:first li[value=" + i + "]"));
        },
        init: function () {
            var slide_val;
            _slide.wrap.find(".slide-lst li:first,.slide-nav li:first").addClass("cur");
            _slide.wrap.find(".slide-lst li,.slide-nav li").each(function () {
                if ($(this).index() == 0) {
                    slide_val = 0;
                }
                $(this).attr("value", slide_val);
                slide_val += 1;
            });

            _slide.wrap.find(".slide-nav li").click(function () {
                clearInterval(_slide.timeOut);
                _slide.click($(this).attr("value"));
            });

            _slide.wrap.find(".slide-lst li").on({
                mouseenter: function () {
                    _slide.over();
                },
                mouseleave: function () {
                    _slide.out();
                }
            });

            _slide.wrap.find(".slide-wrap").hover(function () {
                clearInterval(_slide.timeOut);
            }, function () {
                _slide.out();
            });

            _slide.wrap.find(".slide-lst").clone().addClass("slide-lst-clone").appendTo(_slide.wrap.find(".slide-wrap"));

            if (params.autoplay == true) { //If autoplay is on
                setTimeout(function () {
                    _slide.out();
                }, params.delay)
            }
        },
        out: function () {
            _slide.timeOut = setInterval(function () {
                _slide.next();
            }, params.interval);
        }
    };
    _slide.wrap = this;
    _slide.init();
};

