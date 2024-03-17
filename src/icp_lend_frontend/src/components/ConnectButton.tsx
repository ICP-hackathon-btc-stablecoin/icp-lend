import { useAuth } from "../auth/hooks/useAuth";
import { shortenAddress } from "../utils/shortenAddress";
import Button from "./Button";
import Typography from "./Typography";

export default function ConnectButton() {
  const { identity, login, logout, isAuthenticated } = useAuth();
  const address = identity?.getPrincipal().toString() || "";

  console.log(address);

  if (isAuthenticated) {
    return (
      <div className="flex flex-1 gap-2 items-center">
        <Typography variant="labelS">{shortenAddress(address)}</Typography> <Button onClick={logout}>Logout</Button>
      </div>
    );
  }

  return <Button onClick={login}>Sign in</Button>;
}
