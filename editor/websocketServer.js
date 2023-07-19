//for communication between editor and web

const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8000 });

server.on("connection", (socket) => {
  console.log("new client connected!");

  socket.on("message", (data) => {
    console.log("client has sent message!");
    server.clients.forEach((client) => client.send(JSON.stringify(data)));
  });

  socket.on("close", () => {
    console.log("client has disconnected!");
  });
});
