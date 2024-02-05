// These are all the abstractions that make up SystemLynx
import createClient from "./systemlynx/Client/Client.mjs";
import createHttpClient from "./systemlynx/HttpClient/HttpClient.mjs";
import createDispatcher from "./systemlynx/Dispatcher/Dispatcher.mjs";

export const HttpClient = createHttpClient();
export const Client = createClient();
export const Dispatcher = new createDispatcher();

const systemlynx = {
  // Export these pre-created objects for convenient object destructuring
  // These are the main utilities for app development
  HttpClient,
  Client,
  Dispatcher,
  // Export all modules themselves
  // All these modules export functions
  createClient,
  createHttpClient,
  createDispatcher,
};
export default systemlynx;
