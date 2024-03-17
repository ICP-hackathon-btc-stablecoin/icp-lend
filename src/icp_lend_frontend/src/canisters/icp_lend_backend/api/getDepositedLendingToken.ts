// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useQuery } from "@tanstack/react-query";

export const getDepositedLendingToken = async () => {
  try {
    return icp_lend_backend.getDepositedLendingToken();
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const useGetDepositedLendingToken = () => {
  return useQuery({
    queryKey: ["deposited-lending-token"],
    queryFn: () => getDepositedLendingToken()
  });
};
