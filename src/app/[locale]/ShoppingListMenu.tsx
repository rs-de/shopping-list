"use client";

import { ButtonPrimary } from "@/components/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY } from "../constants";

export default function ShoppingListMenu() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const id = localStorage.getItem(LOCAL_STORAGE_KEY);
    setId(id ?? "");
  }, []);
  const t = useTranslations();
  return id !== null ? (
    id ? (
      <Link
        href={`/${id}`}
        className="w-full flex justify-center hover:text-primary-10 border-2 border-primary-7 hover:border-primary-8 rounded-lg bg-primary-2 p-2 text-lg font-bold text-primary-9 no-underline"
      >
        {t("show-my-list")}
      </Link>
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
