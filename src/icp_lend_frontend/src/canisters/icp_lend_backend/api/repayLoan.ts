import { useMutation } from "@tanstack/react-query";
import getActor from "../../../auth/utils/getActor";
import { queryClient } from "../../../main";

export const repayLoan = async ({ amount, authClient }: any) => {
  try {
    const actor = await getActor(authClient);
    await actor.repay(amount);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const useRepayLoan = () => {
  return useMutation({
    mutationFn: (data: any) => repayLoan(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["borrowed-lending-token"] })
  });
};
