import useIcpLedger from "../hooks/useIcpLedger";
import useIcrcLedger from "../hooks/useIcrcLedger";
import Typography from "./Typography";

const PositionDetails = () => {
  const { balance } = useIcpLedger();
  const { balance: icrcBalance } = useIcrcLedger();

  const details = [
    { label: "Net worth", value: "$ 1500" },
    { label: "Net APY", value: "10%" },
    { label: "Health factor", value: "2.4" }
  ];

  return (
    <div>
      <Typography variant="headlineH6" className="mb-2">
        Current position
      </Typography>

      <div className="flex justify-between">
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

        <div className="text-right flex gap-8">
          <div>ICP: {balance?.toString() || 0}</div>
          <div>ckUSDT: {icrcBalance?.toString() || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default PositionDetails;
