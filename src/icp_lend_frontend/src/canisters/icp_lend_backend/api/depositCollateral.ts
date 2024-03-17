import { useMutation } from "@tanstack/react-query";
import getActor from "../../../auth/utils/getActor";
import { queryClient } from "../../../main";

export const depositCollateral = async ({ amount, authClient }: any) => {
  try {
    const actor = await getActor(authClient);
    await actor.depositCollateral(amount);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const useDepositCollateral = () => {
  return useMutation({
    mutationFn: (data: any) => depositCollateral(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deposited-collateral"] })
  });
};
