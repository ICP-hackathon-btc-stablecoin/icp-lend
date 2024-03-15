import { useAuth } from "../auth/hooks/useAuth";
import Button from "./Button";

export default function ConnectButton() {
  const { login, logout, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Button onClick={logout}>Logout</Button>;
  }

  return <Button onClick={login}>Sign in</Button>;
}
