import { envServer } from "@/data/env/server";
import Mux from "@mux/mux-node";

export const mux = new Mux({
  tokenId: envServer.MUX_TOKEN_ID,
  tokenSecret: envServer.MUX_TOKEN_SECRET,
});
