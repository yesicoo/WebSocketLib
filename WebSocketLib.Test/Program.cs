using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebSocketLib.Test
{
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
        /// <param name="commKey">返回响应的注册命令</param>
        /// <param name="guid">客户端ID</param>
        /// <param name="keyValues">客户端发送的数据</param>
        private static void DoHello(string replyKey, Guid guid, Dictionary<string, string> keyValues)
        {
            Console.WriteLine(string.Format("CommKey:{0};Key1:{1}", replyKey, keyValues.Count()));
            wsMain.SendMessage(guid, replyKey, keyValues);
            wsMain.SendMessage(guid, "SB", keyValues);
        }
    }
}
