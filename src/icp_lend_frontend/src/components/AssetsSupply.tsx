import { useCallback, useState } from "react";
import useIcpLedger from "../hooks/useIcpLedger";
import { ICP_MOCK_PRICE, collateralToken } from "../utils/constants";
import { formatToken, parseToken } from "../utils/tokens";
import Button from "./Button";
import Card from "./Card";
import Table from "./Table";
import Typography from "./Typography";
import Modal from "./Modal";
import Input from "./Input";
import { useDepositCollateral } from "../canisters/icp_lend_backend/api/depositCollateral";
import toast from "react-hot-toast";

const AssetsSupply = () => {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { balance } = useIcpLedger();

  const { mutate: depositCollateral, isPending } = useDepositCollateral();

  const handleSubmit = useCallback(async () => {
    if (!amount) {
      toast.error("Insert amount");
      return;
    }

    try {
      depositCollateral(parseToken(amount), {
        async onSuccess() {
          toast.success("Amount deposited!");
          setIsModalOpen(false);
        },
        onError() {
          toast.error("Something went wrong");
        }
      });
    } catch (err) {
      toast.error("Something went wrong");
    }
  }, [amount, depositCollateral]);

  return (
    <>
      <Card>
        <Typography variant="headlineH6" className="text-secondary-500">
          Assets to supply
        </Typography>
        <div className="pt-6">
          <Table
            columns={[{ name: "Asset" }, { name: "Wallet balance" }, { name: "APY" }, { name: "" }]}
            rows={[
              [
                <div className="flex gap-2 items-center" key={"asset"}>
                  <img src={collateralToken.logo} width="24" /> {collateralToken.symbol}
                </div>,
                "$ " + formatToken(ICP_MOCK_PRICE * balance),
                "-",
                <Button key={"action"} onClick={() => setIsModalOpen(true)}>
                  Deposit
                </Button>
              ]
            ]}
          />
        </div>
      </Card>
      <Modal
        title={`Supply ${collateralToken.symbol}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isPending}
      >
        <Input value={amount} onChange={(e: any) => setAmount(e.target.value)} label="Amount" placeholder="0.00" />
      </Modal>
    </>
  );
};

export default AssetsSupply;
