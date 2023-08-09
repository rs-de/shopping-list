import { ButtonPrimary } from "@/components/Button";
import TextShadow from "@/components/TextShadow";
import Typography from "@/components/Typography";
import { useTranslations } from "next-intl";
import ShoppingListMenu from "./ShoppingListMenu";

export default function Index() {
  const t = useTranslations();
  return (
    <Typography className="flex-1 flex flex-col justify-between items-center w-full mt-4">
      <TextShadow className="flex flex-col items-center">
        <h1 className="text-primary-11">{t("ShoppingList")}</h1>
        <p className="text-white">Simple - Secure - Anonymous - Free</p>
      </TextShadow>
      <ShoppingListMenu />
      &nbsp;
    </Typography>
  );
}
