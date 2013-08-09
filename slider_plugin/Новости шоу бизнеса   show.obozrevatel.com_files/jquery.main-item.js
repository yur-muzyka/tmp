$.fn.mainItem = function (params) {
    params = $.extend({
        autoplay: true,
        delay: 0,
        interval: 3000
    }, params);

    var _mi = {
        count: 0,
        pos: 0,
        markerPos: 0,
        timeOut: null,
        wrap: null,
        next: function () {
            var pos = _mi.pos == _mi.count ? 0 : _mi.pos + 1;
            _mi.show(pos);
        },
        prev: function () {
            var pos = _mi.pos == 0 ? _mi.count : _mi.pos - 1;
            _mi.show(pos);
        },
        show: function (i) {
            _mi.wrap.find(".mi-blk-clone").stop(true).fadeOut(function () {
                _mi.wrap.find("li").removeClass("cur");
                _mi.wrap.find("li[value=" + i + "]").addClass("cur");
                _mi.wrap.find(".mi-blk-clone ul").each(function () {
                    $(this).find("li:first").before($(this).find("li[value=" + i + "]"));
                });
                $(this).show();
            });
            _mi.wrap.find(".mi-blk:first ul").each(function () {
                $(this).find("li:first").before($(this).find("li[value=" + i + "]"));
            });
            if (i == 0) {
                _mi.markerPos = 0;
            } else if (i == _mi.count) {
                _mi.markerPos = _mi.wrap.find(".mi-nums-cur").height() * _mi.count;
            } else if (_mi.pos > i) {
                _mi.markerPos -= _mi.wrap.find(".mi-nums-cur").height();
            } else if (_mi.pos < i) {
                _mi.markerPos += _mi.wrap.find(".mi-nums-cur").height();
            }
            _mi.wrap.find(".mi-nums-cur").stop(true).animate({
                top: _mi.markerPos
            }, 400);
            _mi.pos = i;
        },
        over: function (e) {
            clearInterval(_mi.timeOut);
            var i = parseInt(e.attr("value"));
            if (_mi.wrap.find(".mi-blk .mi-imgs .cur").attr("value") == i) {
                return;
            }
            _mi.pos = i;
            _mi.wrap.find("li").removeClass("cur");
            _mi.wrap.find("li[value=" + i + "]").addClass("cur");
            _mi.wrap.find(".mi-blk ul").stop(true).each(function () {
                $(this).find("li:first").before($(this).find("li[value=" + i + "]"));
            });
            _mi.markerPos = e.position().top;
            _mi.wrap.find(".mi-nums-cur").css("top", _mi.markerPos);
        },
        stop: function () {
            clearInterval(_mi.timeOut);
        },
        init: function () {
            var mi_val;
            _mi.wrap.find(".mi-imgs li:first,.mi-news li:first,.mi-nums li:first").addClass("cur");
            _mi.wrap.find(".mi-imgs li,.mi-news li,.mi-nums li").each(function () {
                if ($(this).index() == 0) {
                    mi_val = 0;
                }
                $(this).attr("value", mi_val);
                mi_val += 1;
            });

            _mi.wrap.on("mouseenter", "li", function () {
                _mi.over($(this));
            });
            _mi.wrap.on("mouseenter", function () {
                _mi.stop();
            });
            _mi.wrap.on("mouseleave", function () {
                _mi.out();
            });
            _mi.wrap.find(".arr-next").click(function () {
                _mi.next();
            });
            _mi.wrap.find(".arr-prev").click(function () {
                _mi.prev();
            });
            _mi.wrap.find(".mi-blk").clone().addClass("mi-blk-clone").appendTo(_mi.wrap.find(".mi-body"));

            if (params.autoplay == true) { //If autoplay is on
                setTimeout(function () {
                    _mi.out();
                }, params.delay)
            }
        },
        out: function () {
            _mi.timeOut = setInterval(function () {
                _mi.next()
            }, params.interval);
        }
    };
    _mi.wrap = this;
    _mi.count = _mi.wrap.find(".mi-imgs li").length - 1;
    _mi.init();
};