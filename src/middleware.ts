import createI18nMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/locales";
import { NextRequest } from "next/server";

const i18nMiddleware = createI18nMiddleware({ locales, defaultLocale });

// This function can be marked `async` if using `await` inside
export default function middleware(request: NextRequest) {
  const res = i18nMiddleware(request);
  //ensure no cookies are set, remove it to enable cookies
  res.headers.set("Set-Cookie", "");
  return res;
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
