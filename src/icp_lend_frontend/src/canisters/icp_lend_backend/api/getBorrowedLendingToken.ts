// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useQuery } from "@tanstack/react-query";

export const getBorrowedLendingToken = async () => {
  try {
    return icp_lend_backend.getBorrowedLendingToken();
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const useGetBorrowedLendingToken = () => {
  return useQuery({
    queryKey: ["borrowed-lending-token"],
    queryFn: () => getBorrowedLendingToken()
  });
};
