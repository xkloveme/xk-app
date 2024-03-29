import express from "express";
import bodyParser from "body-parser";
import routes from "./express-routes/index.js";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const wsServer = new WebSocketServer({
  noServer: true,
});

const main = async () => {
  wsServer.on("connection", (socket) => {
    socket.on("message", (message) => {
      console.log("SERVER RECEIVED: socket.on(message)", JSON.parse(message));
      // echo the user
      socket.send(JSON.stringify({ message: "hello client" }));
    });
  });

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use("/", express.static("dist"));
  app.use("/api", routes);

  var server = http.createServer(app);
  server.listen(5282);
  server.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
      wsServer.emit("connection", socket, request);
    });
  });

  console.info(`Server started on port 5282`);
  console.info(`http://127.0.0.1:5282`);
};

main().catch(console.error);

process.on("uncaughtException", function (err) {
  console.info("(¯`·._.·(¯`·._.· MASSIVE ERROR ·._.·´¯)·._.·´¯)");
  console.log("exception: " + err);
  console.info("(¯`·._.·(¯`·._.· MASSIVE ERROR ·._.·´¯)·._.·´¯)");
});
