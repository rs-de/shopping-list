"use client";
import { forwardRef, ForwardedRef } from "react";
import { Button as MuiButton, ButtonProps } from "@mui/base";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { Spinner } from "./Spinner";

const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { children, className = "", ...rest } = props;
  const { pending } = useFormStatus();
  return (
    <MuiButton
      {...rest}
      ref={ref}
      disabled={pending}
      className={`${className} flex items-center justify-center border-2 border-primary-8 hover:border-primary-9 rounded-lg
      bg-slate-2 px-2 min-w-3 min-h-3 disabled:opacity-50`}
    >
      {pending ? <Spinner /> : children}
    </MuiButton>
  );
});

export default Button;

export const ButtonPrimary = ({ className = "", ...props }: ButtonProps) => (
  <Button {...props} className={`font-bold text-blue-11 ${className}`}>
    {props.children}
  </Button>
);
