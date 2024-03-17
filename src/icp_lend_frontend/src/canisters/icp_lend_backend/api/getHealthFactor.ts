// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

import { useQuery } from "@tanstack/react-query";

export const getHealthFactor = async (principal: any) => {
  try {
    return icp_lend_backend.getHealthFactor(principal);
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const useGetHealthFactor = ({ principal }: { principal: any }) => {
  return useQuery({
    queryKey: ["deposited-collateral", principal],
    queryFn: () => getHealthFactor(principal),
    enabled: !!principal
  });
};
