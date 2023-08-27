import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import type { BackendModule } from "i18next";
import { createInstance } from "i18next";

import i18next from "./i18next.server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18n from "./i18n"; // your i18n configuration file
import { resolve } from "node:path";
import resourcesToBackend from "i18next-resources-to-backend";
import FileSystemBackend from "i18next-fs-backend";

import { getContentSecurityPolicy } from "./utils/getContentSecurityPolicy";

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  let callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  let instance = createInstance();
  let lng = await i18next.getLocale(request);
  let ns = i18next.getRouteNamespaces(remixContext);

  const ResourceBackend = resourcesToBackend(
    (language, namespace, callback) => {
      const path = `../public/locales/${language}/${namespace}.json`;
      try {
        const resource = require(path);
        callback(null, resource);
      } catch (error) {
        console.error("Loading server locale failed", error);
        callback(new Error(`Could not locale at ${path}`), null);
      }
    },
  );

  await instance
    .use(initReactI18next)
    .use<FileSystemBackend | BackendModule<object>>(
      process.env.NODE_ENV === "development"
        ? FileSystemBackend
        : ResourceBackend,
    )
    .init({
      ...i18n, // spread the configuration
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render wants to use
      backend: { loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json") },
    });

  const nonce =
    remixContext.staticHandlerContext.loaderData.root?.cspScriptNonce;
  responseHeaders.set(
    "Content-Security-Policy",
    getContentSecurityPolicy(nonce),
  );

  return new Promise((resolve, reject) => {
    let didError = false;
    let { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          let body = new PassThrough();
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;
          console.error(error);
        },
      },
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
