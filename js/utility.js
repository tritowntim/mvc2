function lpad(target, pad, length) {
    var s = target;
    while (s.length < length) {
		s = pad + s;
	}
    return s;
}

function formatTimeText(dt) {
	var ms = ((new Date().getTime()) % 1000).toString(); 
	return dt.toString().substr(0,dt.toString().indexOf("GMT")-1) + '.' + lpad(ms,'0',3) ; 
}