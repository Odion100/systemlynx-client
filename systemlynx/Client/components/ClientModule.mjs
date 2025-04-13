"use strict";
import headerSetter from "./HeaderSetter.mjs";
import ServiceRequestHandler from "./ServiceRequestHandler.mjs";
import SocketDispatcher from "./SocketDispatcher.mjs";
import loadConnectionData from "./loadConnectionData.mjs";

const getProtocol = (url) => url.match(/^(\w+):\/\//)[0];

export default function SystemLynxClientModule(
  httpClient,
  { methods, namespace, route, connectionData, name },
  { port, host, serviceUrl, socketPath },
  Service,
  systemContext
) {
  const events = {};
  const ClientModule = headerSetter.apply({});

  ClientModule.__setConnection = ({ host, port, route, namespace, socketPath }) => {
    ClientModule.__connectionData = () => ({ route, host, port });

    SocketDispatcher.apply(ClientModule, [
      { namespace, socketPath },
      events,
      systemContext,
    ]);
  };
  ClientModule.__setConnection({ host, port, route, namespace, socketPath });

  const reconnectModule = async (cb) => {
    try {
      const url = connectionData.serviceUrl + `?modules=${name}`;
      const { modules, port, host, socketPath } = await loadConnectionData(url);
      const { route, namespace } = modules[0];
      ClientModule.__setConnection({ host, port, route, namespace, socketPath });

      if (typeof cb === "function") cb();
    } catch (error) {
      console.error(`[SystemLynx][ClientModule]: Failed to reconnect service @${url}`);
    }
  };
  const protocol = getProtocol(serviceUrl);
  methods.forEach(({ method, fn }) => {
    ClientModule[fn] = ServiceRequestHandler.apply(ClientModule, [
      httpClient,
      protocol,
      method,
      fn,
      Service,
      connectionData && reconnectModule,
    ]);
  });

  return ClientModule;
}
