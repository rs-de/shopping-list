import { ComponentProps } from "react";

export default function TextShadow({
  children,
  className,
}: ComponentProps<"div">) {
  return (
    <div
      className={`[text-shadow:0px_0px_1em_white,0px_0px_1em_white,0px_0px_1em_white,0px_0px_1em_white,0px_0px_1em_white,0px_0px_1em_white,0px_0px_1em_white] ${className}`}
    >
      {children}
    </div>
  );
}
