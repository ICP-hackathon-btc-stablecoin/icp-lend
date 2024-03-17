import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";

export default function useIcrcLedger(canisterId?: any) {
  const { identity, agent } = useAuth();
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  const getIcrcBalance = useCallback(async () => {
    if (canisterId) {
      const principal = identity?.getPrincipal();

      const ledger = IcrcLedgerCanister.create({
        agent,
        canisterId
      });

      if (principal) {
        const data = await ledger.balance({
          owner: principal
        });

        console.log({ data });

        setBalance(data);
      }
    }
  }, [agent, canisterId, identity]);

  useEffect(() => {
    getIcrcBalance();
  }, [agent, balance, getIcrcBalance, identity]);

  return { balance };
}
