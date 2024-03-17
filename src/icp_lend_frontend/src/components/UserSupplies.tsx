import { useCallback, useState } from "react";
// import { useGetDepositedCollateral } from "../canisters/icp_lend_backend/api/getDepositedCollateral";
import { collateralToken } from "../utils/constants";
import Button from "./Button";
import Card from "./Card";
import Table from "./Table";
import Typography from "./Typography";
import Modal from "./Modal";
import Input from "./Input";
import { useWithdrawCollateral } from "../canisters/icp_lend_backend/api/withdrawCollateral";
import toast from "react-hot-toast";
import { parseToken } from "../utils/tokens";

const UserSupplies = () => {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: withdrawCollateral, isPending } = useWithdrawCollateral();

  const handleSubmit = useCallback(async () => {
    if (!amount) {
      toast.error("Insert amount");
      return;
    }

    try {
      withdrawCollateral(parseToken(amount), {
        async onSuccess() {
          toast.success("Amount withdrawn!");
          setIsModalOpen(false);
        },
        onError() {
          toast.error("Something went wrong");
        }
      });
    } catch (err) {
      toast.error("Something went wrong");
    }
  }, [amount, withdrawCollateral]);

  // const { data } = useGetDepositedCollateral();

  // Get User supplied amount
  const value = BigInt(0);

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
                "$ " + value.toString(),
                "-",
                <Button key={"action"} onClick={() => setIsModalOpen(true)} disabled={Number(value) === 0}>
                  Withdraw
                </Button>
              ]
            ]}
          />
        </div>
      </Card>
      <Modal
        title={`Withdraw ${collateralToken.symbol}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isPending}
      >
        <Input label="Amount" placeholder="0.00" value={amount} onChange={(e: any) => setAmount(e.target.value)} />
      </Modal>
    </>
  );
};

export default UserSupplies;
