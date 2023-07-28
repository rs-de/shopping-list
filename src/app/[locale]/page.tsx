import { ButtonPrimary } from "@/components/Button";
import Typography from "@/components/Typography";
import { useTranslations } from "next-intl";

export default function Index() {
  const t = useTranslations();
  return (
    <Typography className="flex-1 flex flex-col justify-between items-center w-full">
      <div className="flex flex-col items-center">
        <h1 className="text-primary-11">{t("ShoppingList")}</h1>
        <p>Simple - Secure - Free</p>
      </div>
      <form action="/api" method="post">
        <ButtonPrimary type="submit">{t("create_shoppingList")}</ButtonPrimary>
      </form>
      &nbsp;
    </Typography>
  );
}
