var port = process.env.PORT || 5000; // export PORT=80 in .bashrc
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var util = require('util');
var fs = require('fs');
var sys = require('sys');
var uuid = require('uuid');
var exec = require('child_process').exec;
var base_dir = __dirname;
var last_path = '';

function initServer() {
  /* Create server */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
  }));
  server = http.createServer(app)
  server.listen(port, function () {
    console.log("SERVER RUNNING. Port: " + port);
  });
}

function route() {
  app.get("/", function (req, res) {
    res.sendfile('index.html')
    last_path = "";
  });

  app.get("/whosintoyou", function (req, res) {
    res.sendfile(path.join(base_dir, "/whosintoyou/index.html"));
    if (req.url[req.url.length - 1] != "/")
      last_path = "whosintoyou/";
    else
      last_path = "";
  });

  /* serves all the static files */
  app.get(/^(.+)$/, function (req, res) {
    res.sendfile(path.join(base_dir, last_path, req.params[0]));
  });

  app.post("/whosintoyou/sendata", function (req, res) {
    chat = JSON.stringify(req.body);
    file_name = "./tempin/" + uuid.v4() + ".json";

    fs.writeFile(file_name, chat, function (err) {
      if (err) {
        console.log(err);
      }
      cmd = util.format("python ./whosintoyou/whatsapp-parser/Chat.py -f %s -p Facebook -o %s -n %s", file_name, file_name.replace("tempin", "tempout"), "Nikolas Moya".replace(" ", "_"));
      console.log(cmd);
      child = exec(cmd, maxBuffer = (1024 * 1024), function (error, stdout, stderr) {
        console.log(error);
        // console.log("stdout: " + stdout);
        // console.log("stderr: " + stderr);
        // console.log("exec error: " + error);
      });
    });
  });
}

(function main() {
  app = express();
  initServer();
  route();

})();