# WebSocketLib
依赖Fleck的WebSocket通讯的消息类型封装处理

## 使用方法

### Web端
```HTML
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript" src="js/XqWS.js"></script>
		<script type="text/javascript">
			// 创建连接，服务端IP地址，端口
			XQWebSocket("localhost", 18001);
			
			// 注册消息，消息命令字符串，回调方法
			RegisterItem("SB", function(data) {
				document.getElementById("msg").innerHTML += data.yes + "</br>";
			});
			
			function Send() {
				var dataitem = {};
				dataitem["Hah"] = "abcdefghijklmnopqrstuvwxyz";
				dataitem["yes"] = "So What?";
				// 发送数据方法  消息命令字符串，发送的数据
				SendMessage("Hello", dataitem);
			}
		</script>
	</head>

	<body>
		<button onclick="Send()">Test</button>
		<div id="msg">

		</div>
	</body>

</html>
```




### 服务端
```C#
class Program
    {
        static WsMain wsMain = null;
        static void Main(string[] args)
        {
            wsMain = new WsMain(18001); //创建服务器，绑定18001端口
            wsMain.sendLog += wsMain_sendLog; //日志消息
            wsMain.RegisterCommItem("Hello", DoHello); //注册[Hello]命令，回调DoHello方法执行消息
            wsMain.Start(); //启动WebSocket服务
            Console.ReadLine();
        }

        static void wsMain_sendLog(string log)
        {
            Console.WriteLine(log);
        }

        /// <summary>
        /// 回调响应方法
        /// </summary>
        /// <param name="commKey">响应的注册命令</param>
        /// <param name="guid">客户端ID</param>
        /// <param name="keyValues">客户端发送的数据</param>
        private static void DoHello(string commKey, Guid guid, Dictionary<string, string> keyValues)
        {
            Console.WriteLine(string.Format("CommKey:{0};Key1:{2}", commKey, keyValues["Hah"]));

            //发送数据 guid：发送给客户端的ID；commKey：客户端响应的Key；keyValues发送的数据字典。
            wsMain.SendMessage(guid, "SB", keyValues);
        }
    }
```

