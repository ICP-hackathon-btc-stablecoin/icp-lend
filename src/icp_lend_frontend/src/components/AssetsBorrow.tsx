import { useCallback, useState } from "react";
import { lendingToken } from "../utils/constants";
import Button from "./Button";
import Card from "./Card";
import Table from "./Table";
import Typography from "./Typography";
import Modal from "./Modal";
import Input from "./Input";
import { useBorrowAmount } from "../canisters/icp_lend_backend/api/borrowAmount";
import toast from "react-hot-toast";
import { parseToken } from "../utils/tokens";
import { useAuth } from "../auth/hooks/useAuth";

const AssetsBorrow = () => {
  const { authClient } = useAuth();
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: borrowAmount, isPending } = useBorrowAmount();

  const handleSubmit = useCallback(async () => {
    if (!amount) {
      toast.error("Insert amount");
      return;
    }

    try {
      borrowAmount(
        { amount: parseToken(amount), authClient },
        {
          async onSuccess() {
            toast.success("Amount borrowed!");
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
  }, [amount, authClient, borrowAmount]);

  // Get Lending Token amount available in Pool
  const value = "-" || 1000;

  return (
    <>
      <Card>
        <Typography variant="headlineH6" className="text-secondary-500">
          Assets to borrow
        </Typography>
        <div className="pt-6">
          <Table
            columns={[{ name: "Asset" }, { name: "Available" }, { name: "APY" }, { name: "" }]}
            rows={[
              [
                <div className="flex gap-2 items-center" key={"asset"}>
                  <img src={lendingToken.logo} width="24" /> {lendingToken.symbol}
                </div>,
                "$ " + value,
                "10%",
                <Button key={"action"} onClick={() => setIsModalOpen(true)}>
                  Borrow
                </Button>
              ]
            ]}
          />
        </div>
      </Card>
      <Modal
        title={`Borrow ${lendingToken.symbol}`}
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

export default AssetsBorrow;
