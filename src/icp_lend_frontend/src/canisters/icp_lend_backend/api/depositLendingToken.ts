import { useMutation } from "@tanstack/react-query";
import getActor from "../../../auth/utils/getActor";

export const depositLendingToken = async ({ amount, authClient }: any) => {
  try {
    const actor = await getActor(authClient);
    await actor.depositLendingToken(amount);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const useDepositLendingToken = () => {
  return useMutation({
    mutationFn: (data: any) => depositLendingToken(data)
  });
};
