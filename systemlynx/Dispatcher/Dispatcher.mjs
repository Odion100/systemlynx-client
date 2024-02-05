import throttle from "../../utils/throttle.mjs";

export default function createDispatcher(events = {}, systemContext) {
  const Dispatcher = this || {};

  Dispatcher.emit = (eventName, data, event) => {
    if (events[eventName]) {
      events[eventName].forEach((callback) =>
        callback.apply(systemContext, [data, event])
      );
    }
    return Dispatcher;
  };

  Dispatcher.on = (eventName, callback, { limit, interval } = {}) => {
    if (typeof callback !== "function") return Dispatcher;
    const name = callback.name;
    if (typeof interval === "number") callback = throttle(callback, limit, interval);
    if (!events[eventName]) events[eventName] = [];

    if (name) {
      const i = events[eventName].findIndex((fn) => fn.name === callback.name);
      if (i === -1) events[eventName].push(callback);
      else events[eventName][i] = callback;
    } else events[eventName].push(callback);
    return Dispatcher;
  };

  Dispatcher.$clearEvent = (eventName, fn) => {
    if (!events[eventName]) return Dispatcher;

    if (!fn) {
      delete events[eventName];
    } else if (typeof fn === "function") {
      events[eventName] = events[eventName].filter((callback) => {
        return callback.name !== fn.name;
      });
    } else {
      console.error(
        "SystemLynxError: the second parameter of the Dispatcher.$clearEvent takes the original function to the event"
      );
    }

    return Dispatcher;
  };

  return Dispatcher;
}
