let StaticServer = require("static-server");

let server = new StaticServer({
  rootPath: "./dist/", // required, the root of the server file tree
  port: 8000, // required, the port to listen
});

server.start(function () {
  console.log("Server Started At port", server.port);
});
