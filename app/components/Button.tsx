"use client";
import type { ComponentProps } from "react";
import { Spinner } from "./Spinner";

type ButtonProps = ComponentProps<"button"> & { isLoading?: boolean };
export default function Button(props: ButtonProps) {
  const { children, className = "", isLoading, ...rest } = props;
  return (
    <button
      {...rest}
      disabled={isLoading}
      className={`flex items-center justify-center rounded-lg
      bg-slate-2 px-2 min-w-3 min-h-3 disabled:opacity-50 ${className}`}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}

export const ButtonSecondary = ({ className = "", ...props }: ButtonProps) => (
  <Button
    {...props}
    className={`border border-slate-8 hover:border-slate-9 bg-primary-2 p-1 text-sm text-slate-11 hover:text-slate-12 rounded-lg ${className}`}
  >
    {props.children}
  </Button>
);

export const ButtonPrimary = ({ className = "", ...props }: ButtonProps) => (
  <Button
    {...props}
    className={`font-bold text-blue-11 border-2 border-primary-8 hover:border-primary-9 bg-primary-3 ${className}`}
  >
    {props.children}
  </Button>
);
