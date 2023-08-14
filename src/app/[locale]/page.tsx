import TextShadow from "@/components/TextShadow";
import Typography from "@/components/Typography";
import { useTranslations } from "next-intl";
import ShoppingListMenu from "./ShoppingListMenu";

export const runtime = "edge";

export default function Index() {
  const t = useTranslations();
  return (
    <Typography className="flex-1 flex flex-col justify-between items-center w-full mt-4 px-2">
      <TextShadow className="flex flex-col items-center">
        <h1 className="!text-primary-11">{t("ShoppingList")}</h1>
        <h2 className="!text-primary-11">Simple - Secure - Anonymous - Free</h2>
      </TextShadow>
      <ShoppingListMenu />
      &nbsp;
    </Typography>
  );
}
