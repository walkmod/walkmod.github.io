function getTimeInterval(updateDate) {
	var today = Date.today();
	var date = Date.parseExact(updateDate, 'yyyy-MM-ddTHH:mm:ssZ');

	var years = today.getFullYear() - date.getFullYear();

	var days = 365 * years + today.getDayOfYear() - date.getDayOfYear();
	if (days > 30) {
		var months = (days / 30);
		if (days % 30 != 0) {
			months = Math.trunc(months + 1);
		}
		if (months > 12) {
			var yearsAgo = months / 12;
			if (months % 12 != 0) {
				yearsAgo = Math.trunc(yearsAgo + 1);
			}
			return yearsAgo + ' years ago';
		} else {
			return months + ' months ago';
		}
	} else {
		if (days < 0) {
			return 'today at ' + date.toString('HH:mm');
		}
		else if(days == 0){
			return 'yesterday';
		}
		return (days+1) + ' days ago';
	}

}