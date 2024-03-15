import classNames from "classnames";
import { MouseEvent, ReactNode } from "react";
import Spinner from "./Spinner";

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Button = ({ children, disabled, isLoading, onClick }: ButtonProps) => (
  <button
    disabled={disabled}
    className={classNames(
      "rounded-lg p-1 px-2 w-full bg-primary-600 hover:bg-primary-800 transition text-white flex gap-3 justify-center items-center",
      {
        ["opacity-50 pointer-events-none"]: disabled || isLoading
      }
    )}
    onClick={onClick}
  >
    {isLoading && <Spinner className="!w-6 !h-6" />}
    {children}
  </button>
);

export default Button;
