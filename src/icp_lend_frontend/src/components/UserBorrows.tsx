import { useCallback, useState } from "react";
import { lendingToken } from "../utils/constants";
import Button from "./Button";
import Card from "./Card";
import Input from "./Input";
import Modal from "./Modal";
import Table from "./Table";
import Typography from "./Typography";
import { useRepayLoan } from "../canisters/icp_lend_backend/api/repayLoan";
import toast from "react-hot-toast";
import { parseToken } from "../utils/tokens";

const UserBorrows = () => {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: repayLoan, isPending } = useRepayLoan();

  const handleSubmit = useCallback(async () => {
    if (!amount) {
      toast.error("Insert amount");
      return;
    }

    try {
      repayLoan(parseToken(amount), {
        async onSuccess() {
          toast.success("Loan repaid!");
          setIsModalOpen(false);
        },
        onError() {
          toast.error("Something went wrong");
        }
      });
    } catch (err) {
      toast.error("Something went wrong");
    }
  }, [amount, repayLoan]);

  // Get User borrowed amount
  const value = BigInt(0);

  return (
    <>
      <Card>
        <Typography variant="headlineH6" className="text-secondary-500">
          Your borrows
        </Typography>
        <div className="pt-6">
          <Table
            columns={[{ name: "Asset" }, { name: "Debt" }, { name: "APY" }, { name: "" }]}
            rows={[
              [
                <div className="flex gap-2 items-center" key={"asset"}>
                  <img src={lendingToken.logo} width="24" /> {lendingToken.symbol}
                </div>,
                "$ " + value.toString(),
                "-",
                <Button key={"action"} onClick={() => setIsModalOpen(true)} disabled={Number(value) === 0}>
                  Repay
                </Button>
              ]
            ]}
          />
        </div>
      </Card>

      <Modal
        title={`Repay ${lendingToken.symbol}`}
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

export default UserBorrows;
