using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebSocketLib.Test
{
    class Program
    {
      static  WsMain wsMain = null;
        static void Main(string[] args)
        {
            wsMain = new WsMain(18001);
            wsMain.sendLog += wsMain_sendLog;
            wsMain.RegisterCommItem("Hello", DoHello);
            wsMain.Start();
            Console.ReadLine();
        }

        static void wsMain_sendLog(string log)
        {
            Console.WriteLine(log);
        }

        private static void DoHello(string commKey, Guid guid, Dictionary<string, string> keyValues)
        {
            Console.WriteLine(string.Format("CommKey:{0};Guid{1};Key1:{2}", commKey, guid, keyValues["Hah"]));
            wsMain.SendMessage(guid, "SB", keyValues);
        }
    }
}
