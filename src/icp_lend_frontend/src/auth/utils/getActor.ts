// @ts-expect-error "import alias"
import { idlFactory } from "declarations/icp_lend_backend/icp_lend_backend.did.js";

import { Actor, HttpAgent } from "@dfinity/agent";

const getActor = async (authClient: any): Promise<any> => {
  const identity = await authClient.getIdentity();

  const agent = new HttpAgent({ identity });
  agent.fetchRootKey();

  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: process.env.CANISTER_ID_ICP_LEND_BACKEND!
  });

  return actor;
};

export default getActor;
