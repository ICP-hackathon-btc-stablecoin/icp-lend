// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useMutation } from "@tanstack/react-query";

export const withdrawLendingToken = async (amount: any) => {
  try {
    await icp_lend_backend.withdrawLendingToken(amount);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const useWithdrawLendingToken = () => {
  return useMutation({
    mutationFn: (amount: any) => withdrawLendingToken(amount)
  });
};
