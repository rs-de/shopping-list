import stylesheet from "./tailwind.css";
import type {
  HeadersFunction,
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { useChangeLanguage } from "remix-i18next";
import { useTranslation } from "react-i18next";
import i18next from "./i18next.server";
import i18n from "./i18n";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PWAHead from "./PWAHead";
import { Spinner } from "./components/Spinner";
import { Suspense } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ErrorBoundary } from "./routes/$";
import { SnackbarProvider } from "notistack";
import packageJson from "../package.json";
let appVersion = packageJson.version;

export const headers: HeadersFunction = () => {
  return {
    "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
    "x-frame-options": "SAMEORIGIN",
    "x-content-type-options": "nosniff",
    "x-xss-protection": "1; mode=block",
    "referrer-policy": "same-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "content-security-policy":
      "default-src 'self'; style-src 'self'; script-src 'self';",
  };
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.title },
    { name: "description", content: data?.description },
  ];
};

export let handle = {
  i18n: i18n.defaultNS,
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderArgs) {
  let locale = await i18next.getLocale(request);
  const t = await i18next.getFixedT(request);
  const cspScriptNonce = require("crypto").randomBytes(32).toString("hex");
  return json(
    {
      cspScriptNonce,
      locale,
      title: t("page-title"),
      description: t("page-description"),
      appVersion,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}

export default function App() {
  let { locale, cspScriptNonce, appVersion } = useLoaderData();
  let { i18n } = useTranslation();
  useChangeLanguage(locale);
  if (typeof document !== "undefined") {
    cspScriptNonce = "";
  }

  return (
    <html lang={locale} dir={i18n.dir()} data-appversion={appVersion}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <PWAHead />
        <Meta />
        <Links />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body className="box-border min-h-screen bg-primary-1 flex flex-col justify-between">
        <Suspense fallback={<Spinner />}>
          <SnackbarProvider preventDuplicate={true}>
            <Navbar />
            <main className="flex-1 flex flex-col items-center bg-primary-1 bg-blend-exclusion dark:bg-blend-normal bg-one bg-cover bg-center bg-fixed bg-no-repeat">
              <ReactErrorBoundary fallback={<ErrorBoundary />}>
                <Suspense fallback={<Spinner />}>
                  <Outlet />
                </Suspense>
              </ReactErrorBoundary>
            </main>
            <Footer />
          </SnackbarProvider>
        </Suspense>
        <ScrollRestoration nonce={cspScriptNonce} />
        <Scripts nonce={cspScriptNonce} />
        <LiveReload nonce={cspScriptNonce} />
      </body>
    </html>
  );
}
