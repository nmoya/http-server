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
  app.use(bodyParser.json({
    "limit": "50mb",
    "parameterLimit": 50000,
  }));
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    "parameterLimit": 50000,
    extended: true
  }));
  // app.use(bodyParser({
  //   limit: '50mb'
  // }));

  in_files = fs.readdirSync("./tempin");
  out_files = fs.readdirSync("./tempout");

  for (i = 0; i < in_files.length; i++) {
    fs.unlinkSync(path.join("./tempin", in_files[i]));
  }
  for (i = 0; i < out_files.length; i++) {
    fs.unlinkSync(path.join("./tempout", out_files[i]));
  }

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
    in_file_name = "./tempin/" + uuid.v4() + ".json";
    out_file_name = in_file_name.replace("tempin", "tempout");

    fs.writeFile(in_file_name, chat, function (write_error) {
      if (write_error) {
        console.log("[ERROR] Could not create file");
        res.send({
          "error": "Error creating temporary file"
        });
      }
      cmd = util.format("python ./whosintoyou/whatsapp-parser/Chat.py -f %s -p Facebook -o %s -n %s", in_file_name, out_file_name, "Nikolas Moya".replace(" ", "_"));
      console.log(cmd);
      child = exec(cmd, maxBuffer = (1024 * 1024), function (python_error, stdout, stderr) {
        if (!python_error) {
          fs.readFile(out_file_name, 'utf8', function (read_error, data) {
            if (read_error) {
              console.log("[ERROR] Could not read file");
              res.send({
                "error": "Error deleting temporary file"
              });
            }
            console.log(data);
            res.send({
              "stats": data
            });
          });
        } else {
          console.log("[ERROR] Computing features with python script");
          res.send({
            "error": "Error computing chat stats."
          });
        }
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