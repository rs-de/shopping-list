import TextShadow from "~/components/TextShadow";
import Typography from "~/components/Typography";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "react";
import React from "react";
import { NotFound } from "../$";

let Documents: Record<string, FunctionComponent> = {
  en: React.memo(React.lazy(async () => await import(`./about.en.md`))),
  de: React.memo(React.lazy(async () => await import(`./about.de.md`))),
};

export default function About() {
  const { t, i18n } = useTranslation();
  const Doc = Documents[i18n.language];
  if (!Doc) return <NotFound />;
  return (
    <Typography className="mt-2 px-2">
      <TextShadow className="flex flex-col items-center">
        <h1 className="!text-primary-11">{t("ShoppingList")}</h1>
        <h2 className="!text-primary-11">{t("app-teaser-text")}</h2>
      </TextShadow>
      <div className="bg-primary-2/80 p-2 rounded-lg">
        <Doc />
      </div>
    </Typography>
  );
}
