"use client";

import { ShoppingList } from "@/app/api/shoppinglist";
import Typography from "@/components/Typography";
import { useTranslations } from "next-intl";
import { deleteArticles, updateShoppinglist } from "./actions";
import { Fragment, useEffect, useState } from "react";
import InputArticle from "./InputArticle";
import { MdOutlineAdd } from "react-icons/md";
import { ButtonPrimary } from "@/components/Button";
import { FiDelete } from "react-icons/fi";
import { Popover, Transition } from "@headlessui/react";
import TextShadow from "@/components/TextShadow";
import { LOCAL_STORAGE_KEY } from "@/app/constants";
import { useRouter } from "next/navigation";
import ButtonShare from "@/components/ButtonShare";

export default function ShoppingListPage({
  shoppinglist,
  shoppingListDoesNotExist = false,
}: {
  shoppinglist?: ShoppingList;
  shoppingListDoesNotExist: boolean;
}) {
  const t = useTranslations();
  const listId = shoppinglist?._id;
  const [checked, setChecked] = useState(new Set());
  const showDelete = checked.size > 0;
  const router = useRouter();
  useEffect(() => {
    listId && localStorage.setItem(LOCAL_STORAGE_KEY, listId);
  }, [listId]);
  useEffect(() => {
    shoppingListDoesNotExist && localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, [shoppingListDoesNotExist]);

  useEffect(() => {
    if (shoppingListDoesNotExist) {
      router.push("/");
    }
  }, [shoppingListDoesNotExist, router]);

  if (!listId) {
    return (
      <Typography className="flex-1 flex flex-col items-center p-4">
        <div className="border border-yellow-8 rounded-lg p-2 bg-yellow-4 mb-4">
          {t("service_error")}
        </div>
        <form
          action={async function () {
            return new Promise((resolve) => {
              document.onload = () => {
                resolve();
              };
              document.location.reload();
            });
          }}
        >
          <ButtonPrimary type="submit" formMethod="get">
            {t("reload")}
          </ButtonPrimary>
        </form>
      </Typography>
    );
  }

  return (
    <Typography className="flex-1 flex flex-col items-center p-4">
      <TextShadow>
        <h1 className="text-primary-11">{t("shoppinglist-articles")}</h1>
      </TextShadow>
      <form
        id="text"
        action={updateShoppinglist}
        className="w-full bg-primary-2/80 p-2 rounded-xl"
      >
        <input type="hidden" name="_id" value={listId} />
        <div className="w-full grid grid-cols-[1fr_50px] gap-1">
          {shoppinglist.articles.map((article) =>
            ((id: string) => (
              <Fragment key={id}>
                <InputArticle
                  id={id}
                  name={"text"}
                  defaultValue={article.text}
                  className="flex-1"
                />
                <div className="flex justify-center items-center ">
                  <input
                    type="checkbox"
                    name="delete"
                    value={id}
                    className="mt-[0.05rem]"
                    form="delete-form"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChecked(new Set(checked.add(e.target.value)));
                      } else {
                        checked.delete(e.target.value);
                        setChecked(new Set(checked));
                      }
                    }}
                    aria-label="Delete article"
                  />
                </div>
              </Fragment>
            ))(article._id!.toString()),
          )}
        </div>
        <div className="mt-2 w-full flex items-center">
          <MdOutlineAdd />
          <InputArticle
            className="flex-1"
            name={"new"}
            key={shoppinglist.articles.length}
            ariaLabel={t("input_article_to_add")}
          />
        </div>
        <div className="w-full mt-2 flex gap-2">
          <ButtonShare />
          <ButtonPrimary
            type="submit"
            name="_action"
            value="save"
            className="flex-1"
          >
            {t("Add")}
          </ButtonPrimary>
        </div>
      </form>
      <Popover className="w-full">
        {() => (
          <Transition
            show={showDelete}
            className="fixed bg-primary-2/80 rounded-xl shadow-2xl bottom-0 inset-x-0"
            enter="transition-y duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition-y duration-300"
            leaveTo="translate-y-full"
          >
            <Popover.Panel static>
              <form
                id="delete-form"
                action={async (formData) =>
                  deleteArticles(formData).then(() => {
                    setChecked(new Set());
                  })
                }
                className="w-full p-8"
              >
                <input type="hidden" name="_id" value={listId} />
                <div className="flex justify-center">
                  <ButtonPrimary
                    type="submit"
                    name="_action"
                    value="delete"
                    className="w-full"
                  >
                    <FiDelete />
                    &nbsp;
                    {t("delete_selected_articles")}
                  </ButtonPrimary>
                </div>
              </form>
            </Popover.Panel>
          </Transition>
        )}
      </Popover>
    </Typography>
  );
}
