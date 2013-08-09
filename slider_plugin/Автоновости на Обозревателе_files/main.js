var obozrevatel = {
    init_lazy: function () {
        // Lazy load of images
        $("img.lazy").lazyload({
            placeholder: "http://cdn.oboz.ua/css/i/default-horizontal.jpg",
            effect: "fadeIn",
            skip_invisible: false
        });
    },
    init_scroll_to_top: function () {
        // Page scroll top
        if ($(this).scrollTop() == 0) {
            $(".back-top").hide();
        }
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $(".back-top").fadeIn();
            } else {
                $(".back-top").fadeOut();
            }
        });
        $(".back-top").click(function () {
            $("body, html").animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    },
    init_mistake: function () {
        $(document).keydown(function (e) {
            //Ctrl + Enter...
            if ((e.ctrlKey == true) && (e.keyCode == 13)) {
                $.browser = {};
                $.browser.msie = false;
                $.browser.version = 0;
                if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
                    $.browser.msie = true;
                    $.browser.version = RegExp.$1;
                }

                var selectedText;
                if ($.browser.msie && $.browser.version < 9) {
                    var range = document.selection.createRange();
                    selectedText = "" + range.text;
                }
                else {
                    selectedText = "" + window.getSelection();
                }

                if (selectedText != null && selectedText != "") {

                    if (confirm("Вы указали на ошибку в тексте: \n" + selectedText + "\n\n Отослать сообщение об ошибке?")) {
                        $.ajax({
                            type: "POST",
                            url: "/core/mistakehandler.aspx",
                            data: { text: selectedText, url: window.location.href },
                            success: function (o) {
                                alert("Ваше сообщение успешно отправлено. Благодарим за сотрудничество");
                            }
                        });
                    }
                }
            }
        });
    },
    init_facebook_likes: function () {

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/ru_RU/all.js#xfbml=1&appId=607498032616716";
            fjs.parentNode.insertBefore(js, fjs);
        } (document, 'script', 'facebook-jssdk'));

        $(window).load(function () {
            // Facebook like button
            if ($(".soc-links").length || $(".like-blk").length || $(".cmnts-wrap").length) {
                if (!$("#fb-root").length) {
                    $("body").append("<div id='fb-root'/>");
                }

                if ($(".soc-links").length) {
                    $(".soc-links .soc-i").hover(function () {
                        if (!$(this).find(".like-wrap").children().length) {
                            if (window.FB != null) {
                                $(this).find(".like-wrap").html('<fb:like href="' + $(this).closest("li").find(".like-link").attr("href") + '" send="false" layout="button_count" width="100" show_faces="false"></fb:like>');
                                $(this).find(".like-wrap").each(function () {
                                    FB.XFBML.parse(this);
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    init_functions: function () {
        // Init scripts
        $("span.req-init").each(function (i) {
            var params = {};
            var attrs = $("span.req-init")[i].attributes;
            for (var i = 0; i < attrs.length; i++) {
                var attrName = attrs[i].nodeName;
                var attrVal = attrs[i].nodeValue;
                if (attrName != "class" && attrName != "type") {
                    params[attrName] = attrVal;
                }
            }

            var obj = window[$(this).attr("type")];
            if (obj != null) {
                try {
                    obj.init(params);
                } catch(e) { }
            }
        });
    },
    init_all: function () {
        obozrevatel.init_functions();
        obozrevatel.init_lazy();
        obozrevatel.init_scroll_to_top();
        obozrevatel.init_mistake();
        obozrevatel.init_facebook_likes();
    }
};

obozrevatel.init_all();