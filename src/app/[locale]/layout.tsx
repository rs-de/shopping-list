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
              <Link href={"/changelog"}>v{packageJson.version}&nbsp;</Link>
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
