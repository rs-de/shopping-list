import {
  NextIntlClientProvider,
  createTranslator,
  useMessages,
  useTranslations,
} from "next-intl";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Link from "next/link";
import packageJson from "../../../package.json";
import { locales } from "@/i18n/locales";
import { notFound } from "next/navigation";
import Head from "./Head";

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) {
    notFound();
  }
  const messages = useMessages();
  const t = useTranslations();
  return (
    <html lang={locale}>
      <Head />
      <NextIntlClientProvider {...{ locale, messages }}>
        <body className="box-border bg-blue-1 min-h-screen flex flex-col justify-between">
          <Navbar />
          <main className="flex-1 flex flex-col items-center bg-primary-1 bg-blend-exclusion dark:bg-blend-normal bg-one bg-cover bg-center bg-fixed bg-no-repeat">
            {children}
          </main>
          <footer className="flex flex-wrap justify-between bg-slate-2 text-slate-11 text-sm px-4 py-2">
            <div className="whitespace-nowrap">
              &copy;{new Date().getFullYear()} Dipl.-Math. (FH) Jochen Probst
            </div>
            <div className="whitespace-nowrap flex gap-2">
              <Link href={"/about"}>{t("about")}</Link>|
              <Link href={"https://www.rushsoft.de/privacy"}>
                {t("privacy")}
              </Link>
              |
              <Link href={"https://www.rushsoft.de/imprint"}>
                {t("imprint")}
              </Link>
              |
              <Link
                href="https://github.com/rs-de/shopping-list"
                title={t("view_on_github")}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 fill-slate-11"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
                  />
                </svg>
              </Link>
              |<Link href={"/changelog"}>v{packageJson.version}&nbsp;</Link>
            </div>
          </footer>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  if (!locales.includes(locale)) {
    return {};
  }
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });
  return {
    title: { default: t("ShoppingList") },
    description: t("page-meta-description"),
  };
}
