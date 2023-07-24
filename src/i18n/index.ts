import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "./locales";

export default getRequestConfig(async ({ locale }) => ({
  messages: {
    ...(await import(`../../messages/${defaultLocale}.json`)).default,
    ...(await import(`../../messages/${locale}.json`)).default,
  },
  timeZone: "Europe/Berlin",
  now: new Date(),
  formats: {
    dateTime: {
      short: {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    },
  },
}));
