// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useMutation } from "@tanstack/react-query";

export const repayLoan = async (amount: any) => {
  try {
    await icp_lend_backend.repay(amount);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const useRepayLoan = () => {
  return useMutation({
    mutationFn: (amount: any) => repayLoan(amount)
  });
};
