import { useMutation } from "@tanstack/react-query";
import getActor from "../../../auth/utils/getActor";
import { queryClient } from "../../../main";

export const withdrawCollateral = async ({ amount, authClient }: any) => {
  try {
    const actor = await getActor(authClient);
    await actor.withdrawCollateral(amount);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const useWithdrawCollateral = () => {
  return useMutation({
    mutationFn: (data: any) => withdrawCollateral(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deposited-collateral"] })
  });
};
