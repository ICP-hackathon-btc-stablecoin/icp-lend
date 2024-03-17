// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useMutation } from "@tanstack/react-query";

export const borrowAmount = async (amount: any) => {
  try {
    await icp_lend_backend.borrow(amount);
  } catch (error: any) {
    console.error(error);
  }
};

export const useBorrowAmount = () => {
  return useMutation({
    mutationFn: (amount: any) => borrowAmount(amount)
  });
};
