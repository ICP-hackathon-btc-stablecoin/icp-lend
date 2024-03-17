import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";

export default function useIcrcLedger(canisterId?: any) {
  const { identity, agent } = useAuth();
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [tokenAllowance, setTokenAllowance] = useState<any>(BigInt(0));

  const ledger = IcrcLedgerCanister.create({
    agent,
    canisterId
  });

  const checkAllowance = useCallback(async () => {
    const principal = identity?.getPrincipal();
    if (principal) {
      const data = await ledger.allowance({
        account: { owner: principal, subaccount: [] },
        spender: { owner: Principal.fromText(process.env.CANISTER_ID_ICP_LEND_BACKEND!), subaccount: [] }
      });

      setTokenAllowance(data.allowance);
      return data.allowance;
    }
  }, [identity, ledger]);

  const setAllowance = useCallback(async () => {
    await ledger.approve({
      amount: BigInt(Number.MAX_SAFE_INTEGER),
      spender: { owner: Principal.fromText(process.env.CANISTER_ID_ICP_LEND_BACKEND!), subaccount: [] }
    });
  }, [ledger]);

  const getIcrcBalance = useCallback(async () => {
    if (canisterId) {
      const principal = identity?.getPrincipal();

      if (principal) {
        const data = await ledger.balance({
          owner: principal
        });

        setBalance(data);
      }
    }
  }, [canisterId, identity, ledger]);

  useEffect(() => {
    getIcrcBalance();
    checkAllowance();
  }, [checkAllowance, getIcrcBalance]);

  return { balance, tokenAllowance, checkAllowance, setAllowance };
}
