import { useAuth } from "../auth/hooks/useAuth";
import Button from "./Button";
import Typography from "./Typography";

export default function ConnectButton() {
  const { identity, login, logout, isAuthenticated } = useAuth();
  const address = identity?.getPrincipal().toString() || "";

  if (isAuthenticated) {
    return (
      <div className="flex flex-1 gap-2 items-center">
        <Typography variant="labelS">{address}</Typography>{" "}
        <div>
          <Button onClick={logout}>Logout</Button>
        </div>
      </div>
    );
  }

  return <Button onClick={login}>Sign in</Button>;
}
