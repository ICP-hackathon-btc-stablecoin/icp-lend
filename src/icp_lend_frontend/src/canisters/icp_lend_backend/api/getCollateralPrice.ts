// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useQuery } from "@tanstack/react-query";

export const getCollateralPrice = async () => {
  try {
    return icp_lend_backend.getCollateralPrice();
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const useGetCollateralPrice = () => {
  return useQuery({
    queryKey: ["collateral-price"],
    queryFn: () => getCollateralPrice()
  });
};
