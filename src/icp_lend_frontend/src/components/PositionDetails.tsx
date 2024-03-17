import { useAuth } from "../auth/hooks/useAuth";
import { useGetBorrowedLendingToken } from "../canisters/icp_lend_backend/api/getBorrowedLendingToken";
import { useGetDepositedCollateral } from "../canisters/icp_lend_backend/api/getDepositedCollateral";
import useIcrcLedger from "../hooks/useIcrcLedger";
import { ICP_MOCK_PRICE } from "../utils/constants";
import Typography from "./Typography";

const PositionDetails = () => {
  const { identity } = useAuth();
  const { balance } = useIcrcLedger(process.env.CANISTER_ID_ICP!);
  const { balance: icrcBalance } = useIcrcLedger(process.env.CANISTER_ID_USDT!);

  const { data: borrowedAmount } = useGetBorrowedLendingToken({ principal: identity?.getPrincipal() });
  const { data: depositedCollateral } = useGetDepositedCollateral({ principal: identity?.getPrincipal() });

  const deposited = BigInt(ICP_MOCK_PRICE * (depositedCollateral || BigInt(0)));
  const netWorth = deposited - (borrowedAmount || BigInt(0));

  const details = [
    { label: "Net worth", value: "$ " + netWorth },
    { label: "Health factor", value: "2.4" }
  ];

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Typography variant="headlineH6" className="mb-2">
            Current position
          </Typography>

          <div className="flex gap-12">
            {details.map(({ label, value }, i) => (
              <div key={i}>
                <div>
                  <Typography variant="labelS" className="text-gray-500">
                    {label}
                  </Typography>
                </div>
                <div>
                  <Typography variant="headlineH5" className="text-secondary-500">
                    {value}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Typography variant="headlineH6" className="mb-2 text-right">
            Wallet balance
          </Typography>

          <div className="text-right flex gap-8">
            <div>
              <Typography variant="labelS" className="text-gray-500">
                ICP:{" "}
              </Typography>
              {balance?.toString() || 0}
            </div>
            <div>
              <Typography variant="labelS" className="text-gray-500">
                ckUSDT:{" "}
              </Typography>
              {icrcBalance?.toString() || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionDetails;
