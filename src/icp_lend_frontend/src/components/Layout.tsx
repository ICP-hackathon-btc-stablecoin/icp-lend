import Topbar from "./Topbar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <div className="flex min-h-screen w-full overflow-hidden">
        <div className="relative w-full flex-1 bg-light dark:bg-dark">
          <Topbar />
          <main className="m-auto h-full w-full overflow-auto light:bg-grandient-main flex flex-col pt-topbar pb-10">
            <Outlet />
          </main>
        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { maxWidth: 425 }
        }}
      />
    </>
  );
}
