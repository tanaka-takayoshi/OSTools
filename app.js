var express = require('express');
var app = express.createServer();
//ローカル実行時のポート
var port_local = 8124;

//静的コンテンツの公開
app.use(express.static(__dirname + '/public'));

//「/」アクセスをリダイレクト
app.get('/', function(req, res){
  app.redirect("/index.html");
});

//コマンド実行のリクエストを捌く
app.get("/command", function(req, res){
  console.log('command');
  var cmdstr;

  var util = require('util'),
      exec = require('child_process').exec,
      child;

    var wd = req.param("wd");
    var cmd = req.param("cmd");
    console.log('input command is:' + cmd);
    console.log('at:' + wd);

    child = exec(cmd,
    { encoding: 'utf8',
    timeout: 0,
    maxBuffer: 200*1024,
    killSignal: 'SIGTERM',
    cwd: wd,
    env: process.env },

    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      cmdstr = stdout;
      console.log('stderr: ' + stderr);
      //標準出力をレスポンスとして返す
	  res.end(cmdstr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    }
  );
});

app.listen(process.env.VMC_APP_PORT || port_local);
console.log('kcmd: Server running');