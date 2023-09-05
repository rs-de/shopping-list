"use client";

import { ButtonPrimary } from "~/components/Button";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY } from "../../constants";
import { api, isFetchBaseQueryError } from "~/store/api";
import { useSnackbar } from "notistack";
import { ClientOnly } from "remix-utils";
import { Spinner } from "~/components/Spinner";
import invariant from "tiny-invariant";

function ShoppingListMenu() {
  let [_id, setId] = useState<string | null>(null);
  let [createShoppinglist, { isLoading }] = api.usePostShoppingListMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    let _id = localStorage.getItem(LOCAL_STORAGE_KEY);
    setId(_id ?? "");
  }, []);
  let { t } = useTranslation();
  return _id !== null ? (
    _id ? (
      <Link
        to={`/${_id}`}
        className="w-full flex justify-center hover:text-primary-10 border-2 border-primary-7 hover:border-primary-8 rounded-lg bg-primary-2 p-2 text-lg font-bold text-primary-9 no-underline"
      >
        {t("show-my-list")}
      </Link>
    ) : (
      <form
        method="post"
        onSubmit={async (e) => {
          try {
            e.preventDefault();
            let { _id } = await createShoppinglist().unwrap();
            invariant(Boolean(_id), "id is falsy");
            navigate(`/${_id}`);
          } catch (error) {
            if (isFetchBaseQueryError(error) && error.status === 429) {
              enqueueSnackbar(t("createShoppinglistRateLimitError"), {
                variant: "warning",
              });
            } else {
              console.warn(error);
              enqueueSnackbar(t("createShoppinglistError"), {
                variant: "error",
              });
            }
          }
        }}
      >
        <ButtonPrimary
          type="submit"
          className="shadow-xl shadow-black w-80 sm:w-96 bg-primary-3/90"
          isLoading={isLoading}
        >
          {t("create_shoppingList")}
        </ButtonPrimary>
      </form>
    )
  ) : null;
}

export default function ShoppingListMenuSC() {
  return (
    <ClientOnly fallback={<Spinner />}>{() => <ShoppingListMenu />}</ClientOnly>
  );
}
