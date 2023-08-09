import { ButtonPrimary } from "@/components/Button";
import TextShadow from "@/components/TextShadow";
import Typography from "@/components/Typography";
import { useTranslations } from "next-intl";

export default function Index() {
  const t = useTranslations();
  return (
    <Typography className="flex-1 flex flex-col justify-between items-center w-full mt-4">
      <TextShadow className="flex flex-col items-center">
        <h1 className="text-primary-11">{t("ShoppingList")}</h1>
        <p className="text-white">Simple - Secure - Anonymous - Free</p>
      </TextShadow>
      <form action="/api" method="post">
        <ButtonPrimary
          type="submit"
          className="shadow-xl shadow-black w-96 bg-primary-3/90"
        >
          {t("create_shoppingList")}
        </ButtonPrimary>
      </form>
    </Typography>
  );
}
