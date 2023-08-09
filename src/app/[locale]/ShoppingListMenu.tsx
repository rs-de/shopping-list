"use client";

import { ButtonPrimary } from "@/components/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY } from "../constants";

export default function ShoppingListMenu() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    async function load() {
      const response = await caches
        .open(LOCAL_STORAGE_KEY)
        .then((cache) => cache.match("/id"));
      setId(response ? await response.json() : "");
    }
    load();
  }, []);
  const t = useTranslations();
  return id !== null ? (
    id ? (
      <Link href={`/${id}`}>{t("show-my-list")}</Link>
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
