"use strict";
import io from "socket.io-client";
import createDispatcher from "../../Dispatcher/Dispatcher.mjs";

export default function SocketDispatcher(namespace, events = {}, systemContext) {
  const dispatcher =
    (this || {}).on && (this || {}).emit
      ? this
      : createDispatcher.apply(this, [events, systemContext]);
  const socket = io.connect(namespace, { reconnection: false });
  socket.on("dispatch", (event) => dispatcher.emit(event.name, event.data, event));
  socket.on("disconnect", () => {
    socket.disconnect();
    dispatcher.emit("disconnect");
  });
  socket.on("connect", () => dispatcher.emit("connect"));

  dispatcher.disconnect = () => socket.disconnect();
  return dispatcher;
}
