// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useMutation } from "@tanstack/react-query";

export const depositCollateral = async (amount: any) => {
  try {
    await icp_lend_backend.depositCollateral(amount);
    return;
  } catch (error: any) {
    console.error(error);
    return;
  }
};

export const useDepositCollateral = () => {
  return useMutation({
    mutationFn: (amount: any) => depositCollateral(amount)
  });
};
