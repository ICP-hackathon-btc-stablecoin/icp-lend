import classNames from "classnames";
import Button from "./Button";

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

export const placeholderRow = (i: number, btnLabel = "Withdraw") => [
  <div className="flex gap-2 items-center" key={"asset-" + i}>
    <img src="https://app.zerolend.xyz/icons/tokens/usdc.svg" width="24" alt="USDC icon" /> USDC
  </div>,
  "$ 250",
  "10%",
  <Button key={"action-" + i}>{btnLabel}</Button>
];

export default Table;
