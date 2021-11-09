var http = require("http");
var url = require("url");
var querystring = require("querystring");
var fs = require("fs");
var port = 8000; 

var server = http.createServer(); 

var userDatabase = []; 

server.on("request", function (request, response) {
  var currentRoute = url.format(request.url); 
  var currentMethod = request.method;
  var requestBody = ""; 

  switch (currentRoute) {

    case "/":
      fs.readFile(__dirname + "/index.html", function (err, data) {

        var headers = {

          "Content-Type": "text/html",
        };
        response.writeHead(200, headers);
        response.end(data); 
      }); 

      break;


    case "/emails":


      if (currentMethod === "POST") {
        request.on("data", function (chunk) {
          requestBody += chunk.toString();
        });
        const { headers } = request;
        let ctype = headers["content-type"];
        console.log("RECEIVED Content-Type: " + ctype + "\n");
        request.on("end", function () {
          var userData = "";
          if (ctype.match(new RegExp('^application/x-www-form-urlencoded'))) {
            userData = querystring.parse(requestBody);
          } else {
            userData = JSON.parse(requestBody);
          }
          userDatabase.push(userData);
          console.log(
            "USER DATA RECEIVED: \n\n" +
              JSON.stringify(userData, null, 2) +
              "\n"
          );

          var headers = {
            "Content-Type": "text/plain",
          };
          response.writeHead(200, headers);
          response.end();
        });
      }
      else if (currentMethod === "GET") {
        var headers = {
          "Content-Type": "application/json",
        };
        console.log(
          "USER DATABASE REQUESTED: \n\n" +
            JSON.stringify(userDatabase, null, 2) +
            "\n"
        );
        response.writeHead(200, headers);
        response.end(JSON.stringify(userDatabase));
      }
      break;
  }
});

// Set up the HTTP server and listen on port 8000
server.listen(port, function () {
  console.log("AJAX (HTTP) API server running on port: " + port );
});
