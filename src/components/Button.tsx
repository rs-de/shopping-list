"use client";
import { forwardRef, ForwardedRef } from "react";
import { Button as MuiButton, ButtonProps } from "@mui/base";

const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { children, className } = props;
  return (
    <MuiButton
      {...props}
      slotProps={{
        root: () => ({ className }),
      }}
      ref={ref}
    >
      {children}
    </MuiButton>
  );
});

export default Button;

export const ButtonPrimary = (props: ButtonProps) => (
  <Button
    {...props}
    className={`border border-transparent border-primary-3 hover:border-primary-7 rounded-lg
      bg-primary-9 hover:bg-primary-10 p-2 text-white ${props.className}`}
  >
    {props.children}
  </Button>
);
