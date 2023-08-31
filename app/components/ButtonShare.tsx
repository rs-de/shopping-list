"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonSecondary } from "./Button";

export default function ButtonShare(props: ComponentProps<"button">) {
  const { t } = useTranslation();
  const [hasShare, setHasShare] = useState(true);
  useEffect(() => {
    //beware, share is only available in secure contexts (https)
    setHasShare(nativeShareIsAvailable());
  }, []);

  return (
    <ButtonSecondary
      type="button"
      className="group flex justify-center items-center"
      onClick={async (e) => {
        const url = String(
          document.querySelector('link[rel="canonical"]') ||
            document.location.href,
        );
        if (hasShare) {
          try {
            e.preventDefault();
            navigator.share({
              url,
              text: t("share-text"),
              title: document.title,
            });
            return false;
          } catch (error) {
            console.error(error);
          }
        } else {
          //clipboard is not supported in all browsers!
          await navigator.clipboard?.writeText(url);
        }
      }}
      title={hasShare ? t("share-text") : t("copy-link-tile")}
    >
      <svg
        className="fill-slate-11 group-hover:fill-slate-12"
        width={20}
        height={20}
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z"></path>
          <path d="M24 7h2v21h-2z"></path>
          <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"></path>
        </g>
      </svg>
      {hasShare ? t("share") : t("copy-link")}
    </ButtonSecondary>
  );
}

//a function will ignore linter warning "This condition will always return true since this function is always defined. Did you mean to call it instead?ts(2774)"
//since location.share is not supported in all browsers!
function nativeShareIsAvailable() {
  return Boolean(navigator.share);
}
