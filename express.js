const port = 8102;
const express = require("express");
const path = require("path");
const server = express();

server.use(express.static(__dirname + "/grade/public"));

server.listen(port, function () {
	console.log(`The server is now running on ${port}`);
});

server.get("/grade", function (req, resp) {
	console.log(`Got an http GET request for /grade`);
	console.log(`Query String: ${req.query}`);

	resp.sendFile(path.join(__dirname, "/grade/grade.html"));
});

server.post("/login", function (req, resp) {
	console.log("Got an http POST request to /login");
});

// for any other route, we will catch it with this
server.get("*", function (req, resp) {
	console.log("Got a request for an unsupported route");
});
