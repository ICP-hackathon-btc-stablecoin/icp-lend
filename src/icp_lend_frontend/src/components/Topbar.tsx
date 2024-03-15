import classNames from "classnames";
import Typography from "./Typography";
import ConnectButton from "./ConnectButton";

const Topbar = () => {
  return (
    <div className={classNames("z-30 fixed w-full top-0 border-b border-b-secondary-50")}>
      <div className="flex w-full justify-between gap-4 px-6 py-4 backdrop-blur-lg bg[hsla(240,7%,97%,.6)] bg-transparent">
        <div className="flex gap-2 items-center">
          <img className="dark:hidden" src={"/logo.png"} alt="logo" width={100} />
          <div className="flex flex-col">
            <Typography variant="headlineH3" className="text-secondary-950">
              ICP LEND
            </Typography>
            <Typography variant="labelXS" className="text-secondary-700">
              PROTOCOL
            </Typography>
          </div>
        </div>

        <div>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
