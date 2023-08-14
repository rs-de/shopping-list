import TextShadow from "@/components/TextShadow";
import Typography from "@/components/Typography";
import { getTranslations } from "next-intl/server";

async function loadMarkdown(locale: string) {
  const { default: Markdown } = await import(`./about.${locale}.md`);
  return Markdown;
}

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const Markdown = await loadMarkdown(locale);
  const t = await getTranslations();
  return (
    <Typography className="mt-2 px-2">
      <TextShadow className="flex flex-col items-center">
        <h1 className="!text-primary-11">{t("ShoppingList")}</h1>
        <h2 className="!text-primary-11">Simple - Secure - Anonymous - Free</h2>
      </TextShadow>
      <div className="bg-primary-2/80 p-2 rounded-lg">
        <Markdown />
      </div>
    </Typography>
  );
}
