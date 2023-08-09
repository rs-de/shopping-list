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

export default function ShoppingListPage({
  shoppinglist,
}: {
  shoppinglist: ShoppingList;
}) {
  const t = useTranslations();
  const listId = shoppinglist._id;
  const [checked, setChecked] = useState(new Set());
  const showDelete = checked.size > 0;
  useEffect(() => {
    async function save() {
      (await caches.open(LOCAL_STORAGE_KEY)).put(
        "/id",
        new Response(JSON.stringify(listId)),
      );
    }
    save();
  });
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
                <label className="box flex justify-center items-center ">
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
                  />
                </label>
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
        <ButtonPrimary
          type="submit"
          name="_action"
          value="save"
          className="w-full mt-2"
        >
          {t("Add")}
        </ButtonPrimary>
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
                onChange={(e) => console.log(e)}
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
