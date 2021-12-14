const port = 8102;
const express = require("express");
const path = require("path");
const server = express();

//Grant access to all the public directories
server.use(express.static(__dirname + "/grade/public"));
server.use(express.static(__dirname + "/session/public"));
server.use(express.static(__dirname + "/dashboard/public"));

server.listen(port, function () {
	console.log(`The server is now running on ${port}`);
});

server.get("/grade", function (req, resp) {
	console.log(`Got an http GET request for /grade`);

	resp.sendFile(path.join(__dirname, "/grade/grade.html"));
});

server.get("/login", function (req, resp) {
	console.log("Got an http GET request to /login");

	resp.sendFile(path.join(__dirname, "/session/login.html"));
});

server.get("/dashboard", function (req, resp) {
	console.log("Got an http GET request to /dashboard");

	resp.sendFile(path.join(__dirname, "/dashboard/dashboard.html"));
});

// for any other route, we will catch it with this
server.get("*", function (req, resp) {
	console.log("Got a request for an unsupported route");
});
