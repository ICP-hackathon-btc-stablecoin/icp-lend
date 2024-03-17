// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useMutation } from "@tanstack/react-query";

export const withdrawCollateral = async (amount: any) => {
  try {
    await icp_lend_backend.withdrawCollateral(amount);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const useWithdrawCollateral = () => {
  return useMutation({
    mutationFn: (amount: any) => withdrawCollateral(amount)
  });
};
