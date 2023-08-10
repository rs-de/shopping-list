"use client";

import { useTranslations } from "next-intl";
import { ComponentProps } from "react";

export default function ButtonShare(props: ComponentProps<"button">) {
  const t = useTranslations();
  const text = nativeShareIsAvailable() ? t("share") : t("copy-link");
  return (
    <button
      type="button"
      className="group flex justify-center items-center border border-slate-8 hover:border-slate-9 bg-primary-2 p-1 text-sm text-slate-11 hover:text-slate-12 rounded-lg"
      onClick={async (e) => {
        const url = String(
          document.querySelector('link[rel="canonical"]') ||
            document.location.href,
        );
        if (navigator.share) {
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
          await navigator.clipboard.writeText(url);
        }
      }}
      title={nativeShareIsAvailable() ? "" : t("copy-link-tile")}
    >
      <svg
        fill="#dddddd"
        width={20}
        height={20}
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z"></path>
          <path d="M24 7h2v21h-2z"></path>
          <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"></path>
        </g>
      </svg>
      {text}
    </button>
  );
}

//as a function will ignore linter warning "This condition will always return true since this function is always defined. Did you mean to call it instead?ts(2774)"
//since location.share is not supported in all browsers!
function nativeShareIsAvailable() {
  return navigator.share;
}
