import { useMutation } from "@tanstack/react-query";
import getActor from "../../../auth/utils/getActor";

export const withdrawLendingToken = async ({ amount, authClient }: any) => {
  try {
    const actor = await getActor(authClient);
    await actor.withdrawLendingToken(amount);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const useWithdrawLendingToken = () => {
  return useMutation({
    mutationFn: (data: any) => withdrawLendingToken(data)
  });
};
