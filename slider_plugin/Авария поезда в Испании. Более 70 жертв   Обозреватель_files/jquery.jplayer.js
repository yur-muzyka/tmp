$(function () {
    $(".jp-play").click(function () {
        var func = function () {
            $("#jPlayer")
                .jPlayer("setMedia", {
                    mp3: $(".mp3:first").text()
                })
                .jPlayer("play");
        };
        showLoader(func);
        return false;
    });
    $(".jp-pause").click(function () {
        $("#jPlayer").jPlayer("pause");
        showPlayBtn();
        return false;
    });
});

function showPlayBtn() {
    $(".jp-pause").hide();
    $(".jp-play").show();
};
function showLoader(func) {
    $(".jp-play").hide();
    $(".jp-loader").css("display", "block");
    if (func) func();
};
function InitPlayer() {
    if (!$("#jPlayer").length) {
        $("body").append("<div id='jPlayer'/>");
    }
    $("#jPlayer")
        .jPlayer({
            progress: function () {
                if ($(".jp-loader").is(":visible")) {
                    $(".jp-loader").fadeOut(function () {
                        $(".jp-pause").css("display", "block");
                    });
                }
            },
            volume: 90,
            customCssIds: true,
            supplied: "mp3",
            swfPath: "http://cdn.oboz.ua/js/plugins/jquery.jplayer/js/"
        });

};