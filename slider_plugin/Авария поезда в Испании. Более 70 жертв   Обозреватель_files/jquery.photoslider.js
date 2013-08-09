$.fn.photoSlider = function (params) {
	params = $.extend({
		autoplay: false,
		delay: 0,
		interval: 3000,
		previewAmount: 4,
		speed: 450
	}, params);

	var _photo = {
		disableClick: false,
		timeOut: null,
		itemWidth: 0,
		leftIndent: 0,
		wrap: null,
		next: function (index) { // Go to next photo
			if (index > 0 && index <= _photo.wrap.find(".slide-lst li").length - 1) {
				_photo.leftIndent = _photo.itemWidth * index;
			} else { // Next photo doesn't exist? Go to the first photo in gallery
				index = 0;
				_photo.leftIndent = 0;
			}

			var item = _photo.wrap.find(".slide-lst li:eq(" + index + ")");
			if (item.children().first().prop("tagName").toLowerCase() == "script") {
				var html = item.children().first().text();
				item.empty().html(html);
			}

			_photo.wrap.find(".slide-lst").stop(true).animate({
				marginLeft: -_photo.leftIndent
			}, params.speed, function () {
				_photo.wrap.find(".slide-lst li").removeClass("cur");
				_photo.wrap.find(".slide-lst li:eq(" + index + ")").addClass("cur");
				if (_photo.wrap.find(".slide-nav").length) { // Slider top navigation in points
					_photo.wrap.find(".slide-nav li").removeClass("cur");
					_photo.wrap.find(".slide-nav li:eq(" + index + ")").addClass("cur");
				}
				if (_photo.wrap.find(".preview-lst").length) { // Slider bottom navigation in previews
					_photo.wrap.find(".preview-lst a").removeClass("cur");
					if (_photo.wrap.find(".preview-lst a:eq(" + index + ")").parent().hasClass("cur-group")) {
						_photo.wrap.find(".preview-lst a:eq(" + index + ")").addClass("cur");
					} else {
						var groupIndex = Math.floor(index / params.previewAmount);
						var previewIndex = index % params.previewAmount;

						if (groupIndex > 0 && groupIndex <= _photo.wrap.find(".preview-lst li").length - 1) {
							_photo.leftIndent = _photo.itemWidth * groupIndex;
						} else {
							groupIndex = 0;
							_photo.leftIndent = 0;
						}
						_photo.wrap.find(".preview-lst").stop(true).animate({
							marginLeft: -_photo.leftIndent
						}, params.speed, function () {
							_photo.wrap.find(".preview-lst a").removeClass("cur");
							_photo.wrap.find(".preview-lst li:eq(" + groupIndex + ") a:eq(" + previewIndex + ")").addClass("cur");
							_photo.wrap.find(".preview-lst li").removeClass("cur-group");
							_photo.wrap.find(".preview-lst li:eq(" + groupIndex + ")").addClass("cur-group");
						});
					}
				}
				_photo.disableClick = false;
			});
		},
		prev: function (index) { // Go to previous photo
			if (index < 0) { // Previous photo doesn't exist? Go to the first photo in gallery
				index = _photo.wrap.find(".slide-lst li").length - 1;
			}

			var item = _photo.wrap.find(".slide-lst li:eq(" + index + ")");
			if (item.children().first().prop("tagName").toLowerCase() == "script") {
				var html = item.children().first().text();
				item.empty().html(html);
			}

			_photo.leftIndent = _photo.itemWidth * index;
			_photo.wrap.find(".slide-lst").stop(true).animate({
				marginLeft: -_photo.leftIndent
			}, params.speed, function () {
				_photo.wrap.find(".slide-lst li").removeClass("cur");
				_photo.wrap.find(".slide-lst li:eq(" + index + ")").addClass("cur");
				if (_photo.wrap.find(".slide-nav").length) { // Slider top navigation in points
					_photo.wrap.find(".slide-nav li").removeClass("cur");
					_photo.wrap.find(".slide-nav li:eq(" + index + ")").addClass("cur");
				}
				if (_photo.wrap.find(".preview-lst").length) { // Slider bottom navigation in previews
					_photo.wrap.find(".preview-lst a").removeClass("cur");
					if (_photo.wrap.find(".preview-lst a:eq(" + index + ")").parent().hasClass("cur-group")) {
						_photo.wrap.find(".preview-lst a:eq(" + index + ")").addClass("cur");
					} else {
						var groupIndex = Math.floor(index / params.previewAmount);
						var previewIndex = index % params.previewAmount;

						if (groupIndex < 0) {
							groupIndex = _photo.wrap.find(".preview-lst li").length - 1;
						}
						_photo.leftIndent = _photo.itemWidth * groupIndex;
						_photo.wrap.find(".preview-lst").stop(true).animate({
							marginLeft: -_photo.leftIndent
						}, params.speed, function () {
							_photo.wrap.find(".preview-lst a").removeClass("cur");
							_photo.wrap.find(".preview-lst li:eq(" + groupIndex + ") a:eq(" + previewIndex + ")").addClass("cur");
							_photo.wrap.find(".preview-lst li").removeClass("cur-group");
							_photo.wrap.find(".preview-lst li:eq(" + groupIndex + ")").addClass("cur-group");
						});
					}
				}
				_photo.disableClick = false;
			});
		},
		goTo: function (e) { // Click slider top navigation in points
			if ($(e).index() > _photo.wrap.find(".slide-nav .cur").index()) {
				_photo.next($(e).index());
			} else if ($(e).index() < _photo.wrap.find(".slide-nav .cur").index()) {
				_photo.prev($(e).index());
			} else {
				_photo.disableClick = false;
			}
		},
		click: function (e) { // Click arrows or slider top navigation in points
			clearInterval(_photo.timeOut);
			if ($(e).hasClass("slide-arr-next")) {
				_photo.next(_photo.wrap.find(".slide-lst .cur").next().index());
			} else if ($(e).hasClass("slide-arr-prev")) {
				_photo.prev(_photo.wrap.find(".slide-lst .cur").prev().index());
			} else if ($(e).parent().hasClass("slide-nav")) {
				_photo.goTo(e);
			}
		},
		previewHover: function (e) { // Hover on photos preview
			clearInterval(_photo.timeOut);
			_photo.wrap.find(".preview-lst a").removeClass("cur");
			$(e).addClass("cur");
			var previewIndex = $(e).parent().index() > 0 ? ($(e).parent().index() * params.previewAmount + $(e).index()) : $(e).index();
			if (previewIndex > _photo.wrap.find(".slide-lst .cur").index()) {
				_photo.next(previewIndex);
			} else if (previewIndex < _photo.wrap.find(".slide-lst .cur").index()) {
				_photo.prev(previewIndex);
			} else {
				_photo.disableClick = false;
			}
		},
		previewNext: function (index) { // Click previews arrow next
			if (index > 0 && index <= _photo.wrap.find(".preview-lst li").length - 1) {
				_photo.leftIndent = _photo.itemWidth * index;
			} else {
				index = 0;
				_photo.leftIndent = 0;
			}
			_photo.wrap.find(".preview-lst").stop(true).animate({
				marginLeft: -_photo.leftIndent
			}, params.speed, function () {
				_photo.wrap.find(".preview-lst a").removeClass("cur");
				_photo.wrap.find(".preview-lst li:eq(" + index + ") a:first").addClass("cur");
				_photo.wrap.find(".preview-lst li").removeClass("cur-group");
				_photo.wrap.find(".preview-lst li:eq(" + index + ")").addClass("cur-group");
				_photo.next(index * params.previewAmount);
			});
		},
		previewPrev: function (index) { // Click previews arrow previous
			if (index < 0) {
				index = _photo.wrap.find(".preview-lst li").length - 1;
			}
			_photo.leftIndent = _photo.itemWidth * index;
			_photo.wrap.find(".preview-lst").stop(true).animate({
				marginLeft: -_photo.leftIndent
			}, params.speed, function () {
				_photo.wrap.find(".preview-lst a").removeClass("cur");
				_photo.wrap.find(".preview-lst li:eq(" + index + ") a:first").addClass("cur");
				_photo.wrap.find(".preview-lst li").removeClass("cur-group");
				_photo.wrap.find(".preview-lst li:eq(" + index + ")").addClass("cur-group");
				_photo.prev(index * params.previewAmount);
				_photo.disableClick = false;
			});
		},
		previewArrowClick: function (e) { // Click previews arrows
			clearInterval(_photo.timeOut);
			if ($(e).hasClass("s-arr-next")) {
				_photo.previewNext(_photo.wrap.find(".preview-lst .cur-group").next().index());
			} else if ($(e).hasClass("s-arr-prev")) {
				_photo.previewPrev(_photo.wrap.find(".preview-lst .cur-group").prev().index());
			}
		},
		init: function () {
			_photo.itemWidth = _photo.wrap.find(".slide-wrap").width();

			_photo.wrap.find(".slide-lst li:first,.slide-nav li:first").addClass("cur");
			if ($(".preview-lst").length) {
				$(".preview-lst li:first").addClass("cur-group").find("a:first").addClass("cur");
			}

			_photo.wrap.find(".slide-wrap").hover(function () {
				clearInterval(_photo.timeOut);
			}, function () {
				_photo.out();
			});

			_photo.wrap.find(".slide-arr, .slide-nav li").click(function () {
				if (!_photo.disableClick) {
					_photo.disableClick = true;
					_photo.click(this);
				}
			});

			// Slider previews events
			if (_photo.wrap.find(".preview-blk").length) {
				_photo.wrap.find(".preview-lst a").hover(function () {
					_photo.disableClick = true;
					_photo.previewHover(this);
				});
				_photo.wrap.find(".preview-blk .s-arr").click(function () {
					if (!_photo.disableClick) {
						_photo.disableClick = true;
						_photo.previewArrowClick(this);
					}
				});
			}

			if (params.autoplay == true) { //If autoplay is on
				setTimeout(function () {
					_photo.out();
				}, params.delay)
			}
		},
		out: function () {
			_photo.timeOut = setInterval(function () {
				_photo.next(_photo.wrap.find(".slide-lst .cur").next().index());
			}, params.interval);
		}
	};
	_photo.wrap = this;
	_photo.init();
};