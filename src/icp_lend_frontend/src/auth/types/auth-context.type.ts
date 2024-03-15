import { ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
import _SERVICE from "@dfinity/agent/lib/cjs/canisters/management_service";

import { AuthClient } from "@dfinity/auth-client";

export type AuthContextType = {
  authClient: AuthClient | undefined;
  actor: ActorSubclass<_SERVICE> | undefined;
  identity: Identity | undefined;
  agent: HttpAgent | undefined;
  isAuthenticated: boolean | undefined;
  hasLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};
