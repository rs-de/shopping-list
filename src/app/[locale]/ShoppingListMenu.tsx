"use client";

import { ButtonPrimary } from "@/components/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY } from "../constants";

export default function ShoppingListMenu() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    async function load() {
      const request = indexedDB.open(LOCAL_STORAGE_KEY, 1);
      request.onsuccess = (event: any) => {
        const db = event?.target?.result;
        db
          .transaction(LOCAL_STORAGE_KEY)
          .objectStore(LOCAL_STORAGE_KEY)
          .getAll().onsuccess = function (event: any) {
          setId(event?.target?.result[0]?.id ?? null);
        };
      };
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
