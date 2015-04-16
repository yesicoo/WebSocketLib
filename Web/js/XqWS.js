var CommItems = {};

var XQWebSocket = function(ip, port) {
	var wsImpl = window.WebSocket || window.MozWebSocket;
	window.ws = new wsImpl('ws://' + ip + ':' + port);
	ws.onmessage = function(evt) {
		var m = eval("(" + evt.data + ")");
		var callback = CommItems[m.CommKey];
		callback(m.KeyValues);
	}
	ws.onopen = function() {};
	ws.onerror = function(evt) {};
}
var RegisterItem = function(commKey, callback) {
	CommItems[commKey] = callback;
}

var SendMessage = function(commKey, keyValues) {
	var msg="{\"CommKey\":\""+commKey+"\",\"KeyValues\":{"
	for (kv in keyValues) {
		msg+="\""+kv+"\":\""+keyValues[kv]+"\","
	}
	msg=msg.substring(0,msg.length-1)
	msg=msg+"}}";
	ws.send(msg);
}