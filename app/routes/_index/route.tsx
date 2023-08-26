import { useTranslation } from "react-i18next";
import ShoppingListMenu from "./ShoppingListMenu";
import TextShadow from "~/components/TextShadow";
import Typography from "~/components/Typography";

export default function Index() {
  const { t } = useTranslation();
  return (
    <Typography className="flex-1 flex flex-col justify-between items-center w-full mt-4 px-2">
      <TextShadow className="flex flex-col items-center">
        <h1 className="!text-primary-11">{t("ShoppingList")}</h1>
        <h2 className="!text-primary-11">{t("app-teaser-text")}</h2>
      </TextShadow>
      <ShoppingListMenu />
      &nbsp;
    </Typography>
  );
}

export { ErrorBoundary } from "../$";
