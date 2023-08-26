import type { ComponentProps, ReactNode } from "react";

export default function Batch({
  children,
  icon,
}: ComponentProps<"div"> & { icon: ReactNode }) {
  return (
    <>
      <div className="relative w-full h-0">
        <div className="absolute top-0 right-0 mt-[-23px] mr-[-23px]">
          {icon}
        </div>
      </div>
      {children}
    </>
  );
}
