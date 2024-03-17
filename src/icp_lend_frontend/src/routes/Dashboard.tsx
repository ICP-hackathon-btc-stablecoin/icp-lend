import PositionDetails from "../components/PositionDetails";
import UserSupplies from "../components/UserSupplies";
import AssetsSupply from "../components/AssetsSupply";
import UserBorrows from "../components/UserBorrows";
import AssetsBorrow from "../components/AssetsBorrow";

export default function Dashboard() {
  return (
    <div className="max-w-[1240px] w-full m-auto h-full px-4 pt-16 flex flex-col gap-10">
      <PositionDetails />

      <div className="grid grid-cols-2 gap-6">
        <div className="flex gap-4 w-full flex-col">
          <UserSupplies />
          <AssetsSupply />
        </div>
        <div className="flex gap-4 w-full flex-col">
          <UserBorrows />
          <AssetsBorrow />
        </div>
      </div>
    </div>
  );
}
