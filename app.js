var port = process.env.PORT || 5000; // export PORT=80 in .bashrc
var express = require('express');
var http = require('http');
var path = require('path');
var base_dir = __dirname;
var last_path = '';

function initServer() {
  /* Create server */
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

  /*app.post("/", function(req, res) {
        console.log("Received: " + req.body.url);
        serv_io.sockets.emit('bcast', req.body);
        res.send("Broadcast: \"" + req.body.url + "\" sent!");
    });*/
}

(function main() {
  app = express();
  initServer();
  route();

})();