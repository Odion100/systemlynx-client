import { Client } from "./index.mjs";

Client.loadService("http://localhost:11345/stellar/ai")
  .then(async (service) => {
    console.log(service);
    const { Stellar } = service;
    try {
      console.log("should be waiting");
      const res = await Stellar.chat("whats your name");
      console.log("res--->", res);
    } catch (error) {
      throw error;
    }
  })
  .catch(console.error);
