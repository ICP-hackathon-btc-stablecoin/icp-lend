// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useMutation } from "@tanstack/react-query";

export const depositLendingToken = async (amount: any) => {
  try {
    await icp_lend_backend.depositLendingToken(amount);
  } catch (error: any) {
    console.error(error);
  }
};

export const useDepositLendingToken = () => {
  return useMutation({
    mutationFn: (amount: any) => depositLendingToken(amount)
  });
};
