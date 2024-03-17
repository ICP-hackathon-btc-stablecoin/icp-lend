import { useCallback, useState } from "react";
// import { useGetDepositedCollateral } from "../canisters/icp_lend_backend/api/getDepositedCollateral";
import { ICP_MOCK_PRICE, collateralToken, lendingToken } from "../utils/constants";
import Button from "./Button";
import Card from "./Card";
import Table from "./Table";
import Typography from "./Typography";
import Modal from "./Modal";
import Input from "./Input";
import { useWithdrawCollateral } from "../canisters/icp_lend_backend/api/withdrawCollateral";
import toast from "react-hot-toast";
import { formatToken, parseToken } from "../utils/tokens";
import { useGetDepositedCollateral } from "../canisters/icp_lend_backend/api/getDepositedCollateral";
import { useAuth } from "../auth/hooks/useAuth";
import { useWithdrawLendingToken } from "../canisters/icp_lend_backend/api/withdrawLendingToken";
import { useGetDepositedLendingToken } from "../canisters/icp_lend_backend/api/getDepositedLendingToken";

const UserSupplies = () => {
  const { identity, authClient } = useAuth();
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeToken, setActiveToken] = useState("");

  const { data: depositedCollateral } = useGetDepositedCollateral({ principal: identity?.getPrincipal() });
  const { data: depositedLending } = useGetDepositedLendingToken({ principal: identity?.getPrincipal() });
  const { mutate: withdrawCollateral, isPending } = useWithdrawCollateral();
  const { mutate: withdrawLending, isPending: isPendingLendingToken } = useWithdrawLendingToken();

  const handleSubmit = useCallback(async () => {
    if (!amount) {
      toast.error("Insert amount");
      return;
    }

    try {
      const withdrawFn = activeToken === "icp" ? withdrawCollateral : withdrawLending;

      withdrawFn(
        { amount: parseToken(amount), authClient },
        {
          async onSuccess() {
            toast.success("Amount withdrawn!");
            setIsModalOpen(false);
          },
          onError() {
            toast.error("Something went wrong");
          }
        }
      );
    } catch (err) {
      toast.error("Something went wrong");
    }
  }, [activeToken, amount, authClient, withdrawCollateral, withdrawLending]);

  const value = formatToken((ICP_MOCK_PRICE * (depositedCollateral || BigInt(0))) / BigInt(10 ** 8));
  const valueLending = formatToken(depositedLending || BigInt(0));

  return (
    <>
      <Card>
        <Typography variant="headlineH6" className="text-secondary-500">
          Your supplies
        </Typography>
        <div className="pt-6">
          <Table
            columns={[{ name: "Asset" }, { name: "Balance" }, { name: "APY" }, { name: "" }]}
            rows={[
              [
                <div className="flex gap-2 items-center" key={"asset"}>
                  <img src={collateralToken.logo} width="24" /> {collateralToken.symbol}
                </div>,
                "$ " + value.toString() + ` (${Number(depositedCollateral) / 10 ** 8} ICP)`,
                "-",
                <Button
                  key={"action"}
                  onClick={() => {
                    setActiveToken("icp");
                    setIsModalOpen(true);
                  }}
                  disabled={Number(value) === 0}
                >
                  Withdraw
                </Button>
              ],
              [
                <div className="flex gap-2 items-center" key={"asset-2"}>
                  <img src={lendingToken.logo} width="24" /> {lendingToken.symbol}
                </div>,
                "$ " + valueLending.toString(),
                "-",
                <Button
                  key={"action-2"}
                  onClick={() => {
                    setActiveToken("usdt");
                    setIsModalOpen(true);
                  }}
                  disabled={Number(valueLending) === 0}
                >
                  Withdraw
                </Button>
              ]
            ]}
          />
        </div>
      </Card>
      <Modal
        title={`Withdraw ${activeToken === "icp" ? collateralToken.symbol : lendingToken.symbol}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isPending || isPendingLendingToken}
      >
        <Input label="Amount" placeholder="0.00" value={amount} onChange={(e: any) => setAmount(e.target.value)} />
      </Modal>
    </>
  );
};

export default UserSupplies;
