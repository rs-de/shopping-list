import { NextIntlClientProvider, useMessages } from "next-intl";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { locales } from "@/i18n/locales";

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider {...{ locale, messages }}>
        <body className="box-border bg-blue-1 min-h-screen flex flex-col justify-between">
          <Navbar />
          <main className="flex-1 flex flex-col items-center py-2">
            {children}
          </main>
          <footer className="flex justify-between bg-slate-2 text-slate-11 text-sm px-4 py-2">
            <div className="whitespace-nowrap">
              &copy;{new Date().getFullYear()} Dipl.-Math. (FH) Jochen Probst
            </div>
          </footer>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
