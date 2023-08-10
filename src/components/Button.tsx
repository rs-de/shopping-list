"use client";
import { ComponentProps } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { Spinner } from "./Spinner";

type ButtonProps = ComponentProps<"button">;
export default function Button(props: ButtonProps) {
  const { children, className = "", ...rest } = props;
  const { pending } = useFormStatus();
  return (
    <button
      {...rest}
      disabled={pending}
      className={`flex items-center justify-center rounded-lg
      bg-slate-2 px-2 min-w-3 min-h-3 disabled:opacity-50 ${className}`}
    >
      {pending ? <Spinner /> : children}
    </button>
  );
}

export const ButtonSecondary = ({ className = "", ...props }: ButtonProps) => (
  <Button
    {...props}
    className={`font-bold text-slate-11 border-2 border-slate-8 hover:border-slate-9 ${className}`}
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
