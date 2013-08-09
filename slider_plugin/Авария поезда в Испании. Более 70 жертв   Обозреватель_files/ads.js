if (typeof ads_core != 'undefined') {
	for (var zone in ads_core) {
		var code = ads_core[zone];
		if (code == '' || $.is_device) {
			$('#' + zone).hide();
		} else {
			$('#' + zone).html(code);
		}
	}
}
