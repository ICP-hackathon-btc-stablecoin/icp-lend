import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";

export default function useIcpLedger() {
  const { identity, agent } = useAuth();
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  const getIcpBalance = useCallback(async () => {
    const principal = identity?.getPrincipal();

    const ledger = LedgerCanister.create({
      agent,
      // @ts-expect-error type
      canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai"
    });

    if (principal) {
      const data = await ledger.accountBalance({
        accountIdentifier: AccountIdentifier.fromPrincipal({ principal })
      });

      setBalance(data);
    }
  }, [agent, identity]);

  useEffect(() => {
    getIcpBalance();
  }, [agent, balance, getIcpBalance, identity]);

  return { balance };
}
