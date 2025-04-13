"use strict";
import io from "socket.io-client";
import createDispatcher from "../../Dispatcher/Dispatcher.mjs";

export default function SocketDispatcher(
  { namespace, socketPath: path },
  events = {},
  systemContext
) {
  const dispatcher =
    (this || {}).on && (this || {}).emit
      ? this
      : createDispatcher.apply(this, [events, systemContext]);

  const socket = io.connect(namespace, { path });

  socket.on("dispatch", (event) => dispatcher.emit(event.name, event.data, event));

  socket.on("disconnect", () => {
    socket.disconnect();
    dispatcher.emit("disconnect");
  });

  socket.on("connect", () => {
    console.log("connected");
    dispatcher.emit("connect");
  });

  dispatcher.disconnect = () => socket.disconnect();
  return dispatcher;
}
