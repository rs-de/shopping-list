import { ComponentProps } from "react";

export default function TextShadow({
  children,
  className,
}: ComponentProps<"div">) {
  return (
    <div
      className={`[text-shadow:0px_0px_1em_black,0px_0px_1em_black,0px_0px_1em_black,0px_0px_1em_black,0px_0px_1em_black,0px_0px_1em_black,0px_0px_1em_black] ${className}`}
    >
      {children}
    </div>
  );
}
