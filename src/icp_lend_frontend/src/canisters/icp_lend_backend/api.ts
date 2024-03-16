// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

export const query = {
  getCollateralPrice: async () => icp_lend_backend.getCollateralPrice()
};

export const mutate = {
  depositCollateral: async () => icp_lend_backend.depositCollateral()
};
