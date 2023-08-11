"use client";

import { ButtonPrimary } from "@/components/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY } from "../constants";
import TextShadow from "@/components/TextShadow";

export default function ShoppingListMenu() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const id = localStorage.getItem(LOCAL_STORAGE_KEY);
    setId(id ?? "");
  }, []);
  const t = useTranslations();
  return id !== null ? (
    id ? (
      <TextShadow>
        <Link
          href={`/${id}`}
          className="text-lg font-bold text-primary-9 hover:text-primary-10"
        >
          {t("show-my-list")}
        </Link>
      </TextShadow>
    ) : (
      <form action="/api" method="post">
        <ButtonPrimary
          type="submit"
          className="shadow-xl shadow-black w-96 bg-primary-3/90"
        >
          {t("create_shoppingList")}
        </ButtonPrimary>
      </form>
    )
  ) : null;
}
