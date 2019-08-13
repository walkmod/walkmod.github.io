function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1);
		if (c.indexOf(name) != -1)
			return c.substring(name.length, c.length);
	}
	return "";
}

function getSessionCookie(cookieName, name, stringSession) {

	var revelSession = getCookie(cookieName);
	var stringSession = decodeURIComponent(revelSession);
	var index = stringSession.indexOf("-");
	var stringObject = stringSession.substring(index + 1, stringSession.length);
	var tuplesString = stringObject.split("\x00")
	var i = 0;
	var find = "";
	while (i < tuplesString.length && find === "") {
		if (tuplesString[i].indexOf(name + ":") === 0) {
			find = tuplesString[i].substring((name + ":").length);
		}
		i++;
	}
	find = find.replace('+', ' ');
	
	
	return find;
}