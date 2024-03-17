// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useQuery } from "@tanstack/react-query";

export const getDepositedLendingToken = async (principal: any) => {
  try {
    return icp_lend_backend.getDepositedLendingToken(principal);
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const useGetDepositedLendingToken = ({ principal }: { principal: any }) => {
  return useQuery({
    queryKey: ["deposited-lending-token", principal],
    queryFn: () => getDepositedLendingToken(principal)
  });
};
