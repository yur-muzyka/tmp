$.fn.tabs = function () {
	var _tabs = {
		wrap: null,
		init: function () {
			_tabs.wrap.find(".tabs-head li:first").addClass("cur");
			_tabs.wrap.find(".tabs-head li").hover(function() {
				var itemLi = $(this);
				_tabs.wrap.find(".cur").removeClass("cur");
				itemLi.addClass("cur");
				if (_tabs.wrap.hasClass("r-tabs")) {
			        _tabs.wrap.find(".tab-cnt").css({
			            marginLeft: -itemLi.index() * _tabs.wrap.outerWidth()
			        });
			    }
			    var item = _tabs.wrap.find(".tab-cnt > li:eq(" + itemLi.index() + ")");
				item.addClass("cur");

				if (item.children().first().prop("tagName").toLowerCase() == "script") {
					var html = item.children().first().text();
					item.empty().html(html);
				}
			});
		}
	};
	_tabs.wrap = this;
	_tabs.init();
};