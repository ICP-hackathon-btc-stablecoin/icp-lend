// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useQuery } from "@tanstack/react-query";

export const getBorrowedLendingToken = async (principal: any) => {
  try {
    return icp_lend_backend.getBorrowedLendingToken(principal);
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const useGetBorrowedLendingToken = ({ principal }: { principal: any }) => {
  return useQuery({
    queryKey: ["borrowed-lending-token", principal],
    queryFn: () => getBorrowedLendingToken(principal),
    enabled: !!principal
  });
};
