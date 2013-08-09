$.is_device = (/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent.toLowerCase()));

var _post = function (page, params) {
	var form = $("<form>").attr({ action: page, method: "POST" }).hide();

	$.each(params, function (name, value) {
		form.append($("<input type='hidden' />").attr("name", name).val(value));
	});

	$(document.body).append(form);
	form.submit();
};

function InsureDiv(div,html) {
	if ($('#' + div).length == 0) {
		$('body').append(html);
	}
}
var pop_wrap = '<div class="pop-wrap" id="pop_wrap"></div>';
var popup_login = '\
<div class="pop pop-login" id="popup_login">\
    <div class="pop-blk">\
        <div class="pop-ttl">Мой обозреватель - Вход</div>\
        <div class="pop-body">\
            <form class="login-frm" id="login-frm">\
                <div class="login-frm-blk">\
                    <div class="inp-blk">\
                        <input type="text" id="login_mail" name="login_mail" value="">\
                        <span class="inp-txt hide">Введите e-mail</span>\
                    </div>\
                    <div class="inp-blk">\
                        <input class="inp-pass hide" type="password" id="login_pass" name="login_pass" value="">\
                        <input class="inp-copy" type="text" value="">\
                        <span class="inp-txt hide">Введите пароль</span>\
                    </div>\
                    <div class="rem-link">\
                        <!--<a class="pop-link" href="#popup_pass">Забыли пароль?</a>-->\
						<a href="http://my.obozrevatel.com/remindpassword/">Забыли пароль?</a>\
                    </div>\
                    <div class="btn-wrap">\
                        <a id="login_btn" class="btn">Войти</a>\
                        <div class="check-blk">\
                            <input type="checkbox" id="login_rem" name="login_rem" checked="checked">\
                            <label for="login_rem">Запомнить меня</label>\
                            <div class="clr"></div>\
                        </div>\
                        <div class="clr"></div>\
                        <div class="bot-txt">\
                            <!--<a class="pop-link" href="#popup_reg">Зарегистрироваться</a>-->\
							<a href="http://my.obozrevatel.com/registration/">Зарегистрироваться</a>\
                        </div>\
                    </div>\
                </div>\
            </form>\
            <div class="login-right">\
                <div class="login-right-blk">\
                    <div class="soc-btn fb-btn">\
                        <div class="left">\
                            <div class="ico png24"></div>\
                        </div>\
                        <a id="facebookopen" href="/sso/facebookopen.ashx" class="right">Войти через Facebook</a>\
                        <div class="clr"></div>\
                    </div>\
                    <div class="soc-btn mr-btn">\
                        <div class="left">\
                            <div class="ico png24"></div>\
                        </div>\
                        <a id="mailruopen" href="/sso/mailruopen.ashx" class="right">Войти через <span class="ico png24"></span></a>\
                        <div class="clr"></div>\
                    </div>\
                </div>\
            </div>\
            <div class="clr"></div>\
        </div>\
        <a class="cls-btn">\
            <span class="ico png24"></span>\
        </a>\
    </div>\
</div>\
';
var popup_reg = '\
<div class="pop pop-login" id="popup_reg">\
    <div class="pop-blk">\
        <div class="pop-ttl">Мой обозреватель - Регистрация</div>\
        <div class="pop-body">\
            <form class="login-frm reg-frm" id="reg-frm">\
                <div class="login-frm-blk">\
                    <div class="inp-blk">\
                        <input type="text" id="reg_mail" name="reg_mail" value="">\
                        <span class="inp-txt hide">Введите e-mail</span>\
                    </div>\
                    <div class="inp-blk">\
                        <div class="sucs-ico ico png24"></div>\
                        <input class="inp-pass hide" type="password" id="reg_pass" name="reg_pass" value="">\
                        <input class="inp-copy" type="text" value="">\
                        <span class="inp-txt hide">Введите пароль</span>\
                    </div>\
                    <div class="inp-blk">\
                        <input type="text" id="reg_name" name="reg_name" value="">\
                        <span class="inp-txt hide">Ваше имя</span>\
                    </div>\
                    <div class="inp-blk">\
                        <input type="text" id="reg_surname" name="reg_surname" value="">\
                        <span class="inp-txt hide">Ваша фамилия</span>\
                    </div>\
                    <div class="check-blk">\
                        <input type="checkbox" id="reg_rules" name="reg_rules">\
                        <label for="login_rem">Я согласен с <a href="#">правилами</a></label>\
                        <div class="clr"></div>\
                    </div>\
                    <div class="clr"></div>\
                    <div class="btn-wrap">\
                        <a class="btn">Зарегистрироваться</a>\
                        <div class="bot-txt">\
                            Уже есть аккаунт? <a class="pop-link" href="#popup_login">Войти</a>\
                        </div>\
                    </div>\
                </div>\
            </form>\
            <div class="login-right">\
                <div class="login-right-blk">\
                    <div class="soc-btn fb-btn">\
                        <div class="left">\
                            <div class="ico png24"></div>\
                        </div>\
                        <div class="right">Войти через Facebook</div>\
                        <div class="clr"></div>\
                    </div>\
                    <div class="soc-btn mr-btn">\
                        <div class="left">\
                            <div class="ico png24"></div>\
                        </div>\
                        <div class="right">Войти через <span class="ico png24"></span></div>\
                        <div class="clr"></div>\
                    </div>\
                </div>\
            </div>\
            <div class="clr"></div>\
        </div>\
        <a class="cls-btn">\
            <span class="ico png24"></span>\
        </a>\
    </div>\
</div>\
';

var popup_pass = '\
<div class="pop pop-pass" id="popup_pass">\
    <div class="pop-blk">\
        <div class="pop-ttl">Мой обозреватель - Восстановление пароля</div>\
        <div class="pop-body">\
            <form class="pass-form" id="remind-pass-frm">\
                <label for="pass_mail">Введите Email, который вы указывали при регистрации</label>\
                <div class="inp-blk">\
                    <input type="text" id="pass_mail" name="pass_mail" value="">\
                    <span class="inp-txt hide">Введите e-mail</span>\
                </div>\
                <a class="btn">Отправить пароль</a>\
                <div class="clr"></div>\
            </form>\
            <div class="pop-txt hide">На указанный Email отправлено письмо с инструкциями по сбросу пароля</div>\
        </div>\
        <a class="cls-btn">\
            <span class="ico png24"></span>\
        </a>\
    </div>\
</div>\
';

function ClearError() {
	$('#popup_login').find(".err-blk").remove();
	$('#popup_login').find("input.err").each(function () { $(this).removeClass("err"); });
	$('#popup_login').find(".err").each(function () { $(this).remove(); });
}

$(function () {
    InsureDiv('pop_wrap', pop_wrap);
    InsureDiv('popup_login', popup_login);
    InsureDiv('popup_reg', popup_reg);
    InsureDiv('popup_pass', popup_pass);

    $("#facebookopen").attr("href", "http://obozrevatel.com/sso/facebookopen.ashx?returnUrl=" + encodeURIComponent(document.URL));
    $("#mailruopen").attr("href", "http://obozrevatel.com/sso/mailruopen.ashx?returnUrl=" + encodeURIComponent(document.URL));
    $("#logout_btn").attr("href", "/sso/signout.ashx?returnURL=" + encodeURIComponent(document.URL));

    var mailReg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    $("#login_btn").click(function () {

        var params = {
            email: $("#login_mail").val(),
            password: $("#login_pass").val(),
            remember: $("#login_rem").val(),
            returnUrl: encodeURIComponent(document.URL)
        };

        ClearError();

        if (params.email == '' || params.email == $("#login_mail").parent().find(".inp-txt").text() || !params.email.match(mailReg)) {
            $("#login_mail").parent().find("input").addClass("err");
            if (params.email == '' || params.email == $("#login_mail").parent().find(".inp-txt").text()) {
                $("#login_mail").parent().append('<span class="err">Обязательное поле</span>');
            } else if(!params.email.match(mailReg)) {
                $("#login_mail").parent().append('<span class="err">Неверный формат электронного адреса</span>');
            }
            return;
        }


        if (params.password == '' || params.password == $("#login_pass").parent().find(".inp-txt").text()) {
            $("#login_pass").parent().find("input").addClass("err");
            $("#login_pass").parent().append('<span class="err">Обязательное поле</span>');
            return;
        }

        $.get('/sso/check.ashx', params, function (data) {
            if (data == '0') {
                _post("/sso/signin.ashx", params);
            } else {
                $("#login_pass").parent().after('<div class="err-blk">Неверный e-mail или пароль</div>');
            }
        });
    });

    // Popups
    $('#popup_login').find('input').focus(function () {
        ClearError();
    });

    $(".pop .cls-btn, .pop-wrap").on("click", function () {
        $(".pop, .pop-wrap").hide();
    });

    $(document).keyup(function (event) {
        if (event.keyCode == 27) {
            $(".pop, .pop-wrap").hide();
        }
    });

    $(".inp-blk input")
        .focus(function () {
            if (!$(this).hasClass("inp-copy")) {
                if ($(this).val() == $(this).parent().find(".inp-txt").text()) {
                    $(this).val("");
                }
            } else {
                $(this).hide();
                $(this).parent().find(".inp-pass").show().trigger("focus");
            }
            $(this).addClass("focus");
        })
        .blur(function () {
            if (!$(this).hasClass("inp-pass")) {
                if ($(this).val() == "") {
                    $(this).val($(this).parent().find(".inp-txt").text());
                    $(this).removeClass("focus");
                }
            } else {
                if ($(this).val() == "") {
                    $(this).hide();
                    $(this).parent().find(".inp-copy").show().removeClass("focus");
                }
            }
        })
        .each(function () {
            $(this).val($(this).parent().find(".inp-txt").text());
        });

    $(".pop-link").click(function () {

        $("#pop_wrap").show();
        $(".pop").hide();

        $($(this).attr("href")).show();
        return false;
    });

    $(".pop .cls-btn, .pop-wrap").on("click", function () {
        $(".pop, .pop-wrap").hide();
    });
    $(document).keyup(function (event) {
        if (event.keyCode == 27) {
            $(".pop, .pop-wrap").hide();
        }
    });

    $(".inp-blk input")
            .focus(function () {
                if (!$(this).hasClass("inp-copy")) {
                    if ($(this).val() == $(this).parent().find(".inp-txt").text()) {
                        $(this).val("");
                    }
                } else {
                    $(this).hide();
                    $(this).parent().find(".inp-pass").show().trigger("focus");
                }
                $(this).addClass("focus");
            })
            .blur(function () {
                if (!$(this).hasClass("inp-pass")) {
                    if ($(this).val() == "") {
                        $(this).val($(this).parent().find(".inp-txt").text());
                        $(this).removeClass("focus");
                    }
                } else {
                    if ($(this).val() == "") {
                        $(this).hide();
                        $(this).parent().find(".inp-copy").show().removeClass("focus");
                    }
                }
            })
            .each(function () {
                $(this).val($(this).parent().find(".inp-txt").text());
            });

    $(".pop-link").click(function () {

        $("#pop-wrap").show();
        $(".pop").hide();
        $($(this).attr("href")).show();
        return false;
    });
});