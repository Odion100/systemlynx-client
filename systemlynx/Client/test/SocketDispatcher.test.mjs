// simple-socket-dispatcher-test.mjs

import SocketDispatcher from "../components/SocketDispatcher.mjs";
import createWebSocketServer from "./WebSocketServer.mjs";

const port = 2592;
const socketPath = "/test-namespace";
const route = `/events`;
const namespace = `ws://localhost:${port}${route}`;

const { WebSocket, SocketServer } = createWebSocketServer(socketPath);
const socket = WebSocket.of(route);

socket.on("connect", ({ id }) => {
  console.log(`🧩 Server socket connected with id: ${id}`);
});

SocketServer.listen(port, () => {
  console.log(`🚀 WebSocket server listening on port ${port}`);
});

const dispatcher = new SocketDispatcher({ namespace, socketPath });

dispatcher.on("connect", () => {
  console.log("✅ Dispatcher connected");
});

dispatcher.on("test-event", (data) => {
  console.log("🎉 Received 'test-event' with data:", data);
});

setTimeout(() => {
  console.log("📡 Emitting 'test-event' from server...");
  socket.emit("dispatch", { name: "test-event", data: { testPassed: true } });
}, 500);

// setTimeout(() => {
//   console.log("🛑 Test finished. Shutting down server.");
//   SocketServer.close();
// }, 2000);
