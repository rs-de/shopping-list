"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ButtonBuyMeACoffee from "@/components/ButtonBuyMeACoffee";

export default function Navbar() {
  const [top, setTop] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 50 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <nav
      className={`transition-all z-10 sticky top-0 flex justify-between items-center px-2 py-2 bg-blue-2/80 backdrop-blur-md ${
        !top && "shadow-md"
      }`}
    >
      <div className="text-slate-11">
        <Link href={`/`}>
          <div className="flex items-center h-[40px] ">
            <Image
              priority
              width={80}
              height={40}
              alt="<JP>"
              src="/logo.svg"
              className="mr-2"
            />
            <b>Jochen Probst</b>
          </div>
          <div className="tracking-[0.05em] leading-4 pl-[3px]">
            <small>Web application development</small>
          </div>
        </Link>
      </div>
      <ButtonBuyMeACoffee />
    </nav>
  );
}
