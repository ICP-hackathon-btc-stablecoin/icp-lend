import { useCallback, useState } from "react";
import { ICP_MOCK_PRICE, collateralToken, lendingToken } from "../utils/constants";
import { formatToken, parseToken } from "../utils/tokens";
import Button from "./Button";
import Card from "./Card";
import Table from "./Table";
import Typography from "./Typography";
import Modal from "./Modal";
import Input from "./Input";
import { useDepositCollateral } from "../canisters/icp_lend_backend/api/depositCollateral";
import toast from "react-hot-toast";
import useIcrcLedger from "../hooks/useIcrcLedger";
import { useAuth } from "../auth/hooks/useAuth";
import { useDepositLendingToken } from "../canisters/icp_lend_backend/api/depositLendingToken";

const AssetsSupply = () => {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeToken, setActiveToken] = useState("");

  const { authClient } = useAuth();

  const { balance, tokenAllowance, setAllowance, checkAllowance } = useIcrcLedger(process.env.CANISTER_ID_ICP!);
  const {
    balance: usdtBalance,
    tokenAllowance: usdtTokenAllowance,
    setAllowance: usdtSetAllowance,
    checkAllowance: usdtCheckAllowance
  } = useIcrcLedger(process.env.CANISTER_ID_USDT!);

  const { mutate: depositCollateral, isPending } = useDepositCollateral();
  const { mutate: depositLending, isPending: isPendingLending } = useDepositLendingToken();

  const hasAllowance =
    (activeToken === "icp" ? tokenAllowance : usdtTokenAllowance) >= BigInt(Number(amount) * 10 ** 8);

  const handleSubmit = useCallback(async () => {
    if (!amount) {
      toast.error("Insert amount");
      return;
    }

    try {
      const depositFn = activeToken == "icp" ? depositCollateral : depositLending;

      depositFn(
        { amount: parseToken(amount), authClient },
        {
          async onSuccess() {
            toast.success("Amount deposited!");
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
  }, [activeToken, amount, authClient, depositCollateral, depositLending]);

  const handleApprove = async () => {
    setIsLoading(true);

    if (activeToken === "icp") {
      await setAllowance();
      await checkAllowance();
    }

    if (activeToken === "usdt") {
      await usdtSetAllowance();
      await usdtCheckAllowance();
    }

    setIsLoading(false);
  };

  const value = formatToken((ICP_MOCK_PRICE * (balance || BigInt(0))) / BigInt(10 ** 8));

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
                "$ " + value.toString() + ` (${Number(balance) / 10 ** 8} ICP)`,
                "-",
                <Button
                  key={"action"}
                  onClick={() => {
                    setActiveToken("icp");
                    setIsModalOpen(true);
                  }}
                >
                  Deposit
                </Button>
              ],
              [
                <div className="flex gap-2 items-center" key={"asset-2"}>
                  <img src={lendingToken.logo} width="24" /> {lendingToken.symbol}
                </div>,
                "$ " + formatToken(usdtBalance),
                "-",
                <Button
                  key={"action-2"}
                  onClick={() => {
                    setActiveToken("usdt");
                    setIsModalOpen(true);
                  }}
                >
                  Deposit
                </Button>
              ]
            ]}
          />
        </div>
      </Card>
      <Modal
        title={`Supply ${activeToken === "icp" ? collateralToken.symbol : lendingToken.symbol}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={hasAllowance ? handleSubmit : handleApprove}
        buttonLabel={hasAllowance ? "Submit" : "Approve"}
        isLoading={isPending || isPendingLending || isLoading}
      >
        <Input value={amount} onChange={(e: any) => setAmount(e.target.value)} label="Amount" placeholder="0.00" />
      </Modal>
    </>
  );
};

export default AssetsSupply;
