import { useMutation } from "@tanstack/react-query";
import getActor from "../../../auth/utils/getActor";

export const borrowAmount = async ({ amount, authClient }: any) => {
  try {
    const actor = await getActor(authClient);
    await actor.borrow(amount);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const useBorrowAmount = () => {
  return useMutation({
    mutationFn: (data: any) => borrowAmount(data)
  });
};
