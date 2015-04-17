var CommItems = {};
var wsImpl;
var wsurl;
var isClosed = false;
var check_Interval;
var XQWebSocket = function(ip, port) {
	wsImpl = window.WebSocket || window.MozWebSocket;
	wsurl = 'ws://' + ip + ':' + port;
	start(wsurl);
	check_Interval=setInterval("CheckConn()", 3000)
}

function start(url) {
	window.ws = new wsImpl(wsurl);
	isClosed = false;
	ws.onmessage = function(evt) {
		var m = eval("(" + evt.data + ")");
		var callback = CommItems[m.CommKey];
		callback(m.KeyValues);
	}
	ws.onopen = function() {
		console.log("connection OK");
	};
	ws.onClosed = function() {
		console.log("connection NOK");
	};
	ws.onerror = function() {
		console.log("connection Error");
	};
}

function CheckConn() {
	if (!isClosed & ws.readyState == 3) {
		clearInterval(check_Interval);
		start(wsurl);
	}
}
var RegisterItem = function(commKey, callback) {
	CommItems[commKey] = callback;
}

var UnRegisterItem = function(commKey) {
	CommItems.remove(commKey);
}

var PostMessage = function(commKey, keyValues) {
	if (!isClosed) {
		if (!ws || ws.readyState == 1) {
			ws.send(ToJson(commKey, '', keyValues));
		} else {
			console.log("ws Unavailable!");
		}
	} else {
		console.log("ws Is Closed!");
	}
}
var SendMessage = function(commKey, keyValues,callback) {
	if (!isClosed) {
		if (!ws || ws.readyState == 1) {
			var result=null;
			var RandKey=MathRand(6);
			var msg=ToJson(commKey,RandKey,keyValues);
			RegisterItem(RandKey,function(data){
				UnRegisterItem(RandKey);
				callback(data);
			});
			ws.send(msg);	
		} else {
			console.log("ws Unavailable!");
			return null;
		}
	} else {
		console.log("ws Is Closed!");
		return null;
	}
}

function ToJson(commKey, replyKey, keyValues) {
	var msg = "{\"CommKey\":\"" + commKey + "\",\"ReplyKey\":\"" + replyKey + "\",\"KeyValues\":{"
	for (kv in keyValues) {
		msg += "\"" + kv + "\":\"" + keyValues[kv] + "\","
	}
	msg = msg.substring(0, msg.length - 1)
	msg = msg + "}}";
	return msg;
}

function MathRand(n) {
	var Num = "";
	for (var i = 0; i < n; i++) {
		Num += Math.floor(Math.random() * 10);
	}
	return Num;
}