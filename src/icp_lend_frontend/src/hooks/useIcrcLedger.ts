import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";

export default function useIcrcLedger() {
  const { identity, agent } = useAuth();
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  const getIcpBalance = useCallback(async () => {
    const principal = identity?.getPrincipal();

    const ledger = IcrcLedgerCanister.create({
      agent,
      // @ts-expect-error type
      canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai"
    });

    if (principal) {
      const data = await ledger.balance({
        owner: principal
      });

      console.log({ data });

      setBalance(data);
    }
  }, [agent, identity]);

  useEffect(() => {
    getIcpBalance();
  }, [agent, balance, getIcpBalance, identity]);

  return { balance };
}
