import Typography from "./Typography";

const details = [
  { label: "Net worth", value: "$ 1500" },
  { label: "Net APY", value: "10%" }
];

const PositionDetails = () => {
  return (
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
  );
};

export default PositionDetails;
