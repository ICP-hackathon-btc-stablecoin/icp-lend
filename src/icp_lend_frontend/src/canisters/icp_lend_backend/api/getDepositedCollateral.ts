// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useQuery } from "@tanstack/react-query";

export const getDepositedCollateral = async () => {
  try {
    return icp_lend_backend.getDepositedCollateral();
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const useGetDepositedCollateral = () => {
  return useQuery({
    queryKey: ["deposited-collateral"],
    queryFn: () => getDepositedCollateral()
  });
};
