import Typography from "../components/Typography";
import Card from "../components/Card";
import PositionDetails from "../components/PositionDetails";
import classNames from "classnames";
import Button from "../components/Button";

const placeholderRow = (i: number, btnLabel = "Withdraw") => [
  <div className="flex gap-2 items-center" key={"asset-" + i}>
    <img src="https://app.zerolend.xyz/icons/tokens/usdc.svg" width="24" alt="USDC icon" /> USDC
  </div>,
  "$ 250",
  "10%",
  <Button key={"action-" + i}>{btnLabel}</Button>
];

export default function Dashboard() {
  return (
    <div className="max-w-[1240px] w-full m-auto h-full px-4 pt-16 flex flex-col gap-10">
      <PositionDetails />

      <div className="grid grid-cols-2 gap-6">
        <div className="flex gap-4 w-full flex-col">
          <Card>
            <Typography variant="headlineH6" className="text-secondary-500">
              Your supplies
            </Typography>
            <div className="pt-6">
              <Table
                columns={[{ name: "Asset" }, { name: "Balance" }, { name: "APY" }, { name: "" }]}
                rows={[placeholderRow(1), placeholderRow(2)]}
              />
            </div>
          </Card>

          <Card>
            <Typography variant="headlineH6" className="text-secondary-500">
              Assets to supply
            </Typography>
            <div className="pt-6">
              <Table
                columns={[{ name: "Asset" }, { name: "Balance" }, { name: "APY" }, { name: "" }]}
                rows={[placeholderRow(1, "Supply"), placeholderRow(2, "Supply")]}
              />
            </div>
          </Card>
        </div>
        <div className="flex gap-4 w-full flex-col">
          <Card>
            <Typography variant="headlineH6" className="text-secondary-500">
              Your borrows
            </Typography>
            <div className="pt-6">
              <Table
                columns={[{ name: "Asset" }, { name: "Balance" }, { name: "APY" }, { name: "" }]}
                rows={[placeholderRow(1, "Repay")]}
              />
            </div>
          </Card>

          <Card>
            <Typography variant="headlineH6" className="text-secondary-500">
              Assets to borrow
            </Typography>
            <div className="pt-6">
              <Table
                columns={[{ name: "Asset" }, { name: "Balance" }, { name: "APY" }, { name: "" }]}
                rows={[placeholderRow(1, "Borrow")]}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// TODO: New component
const Table = ({ columns, rows }: { columns: { name: any }[]; rows?: any[][] }) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-pallete-gray-100">
          {columns.map(({ name }, i) => (
            <th key={i} scope="col" className={classNames("p-4 text-left text-sm")}>
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.map((values, i) => (
          <tr key={i} className="border-t">
            {values.map((v, j) => (
              <td className="p-4 py-2" key={j}>
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
