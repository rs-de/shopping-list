"use client";
import { ShoppingList } from "@/app/api/shoppinglist";
import Typography from "@/components/Typography";
import { useTranslations } from "next-intl";
import { deleteArticles, rejigArticles, updateShoppinglist } from "./actions";
import { Fragment, useEffect, useRef, useState } from "react";
import InputArticle from "./InputArticle";
import { Plus, Backspace } from "heroicons-react";
import { ButtonPrimary } from "@/components/Button";
import { Popover, Transition } from "@headlessui/react";
import TextShadow from "@/components/TextShadow";
import { LOCAL_STORAGE_KEY } from "@/app/constants";
import { usePathname, useRouter } from "next/navigation";
import ButtonShare from "@/components/ButtonShare";
import Rejig from "./Rejig";
import { RejigContextProvider } from "./RejigContext";
const appVersion = process.env.npm_package_version;

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
  const showRejig =
    checked.size > 0 && (shoppinglist?.articles.length ?? 0) > 5;
  const router = useRouter();
  const pathname = usePathname();

  //save list id to local storage
  useEffect(() => {
    listId && localStorage.setItem(LOCAL_STORAGE_KEY, listId);
  }, [listId]);
  //remove list id from local storage, if list does not exist
  useEffect(() => {
    shoppingListDoesNotExist && localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, [shoppingListDoesNotExist]);
  //redirect to home page, if list does not exist
  useEffect(() => {
    if (shoppingListDoesNotExist) {
      router.push("/");
    }
  }, [shoppingListDoesNotExist, router]);
  //reload page, if list was updated or app-version changed
  useEffect(() => {
    window.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        fetch(`${pathname}/versions`).then((res) => {
          res
            .json()
            .then(
              (data: { shoppingListVersion: string; appVersion: string }) => {
                if (
                  data.shoppingListVersion !==
                    String(shoppinglist?.updatedAt) ||
                  data.appVersion !== appVersion
                ) {
                  document.location.reload();
                }
              },
            );
        });
      }
    });
  }, [pathname, shoppinglist?.updatedAt]);
  const rejigMenuAnchorElementRef = useRef<HTMLDivElement>(null);

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
      <RejigContextProvider>
        <form
          id="text"
          action={updateShoppinglist}
          className="w-full bg-primary-2/80 p-2 rounded-xl"
        >
          <input type="hidden" name="_id" value={listId} />
          <div className="w-full grid grid-cols-[1fr_50px] gap-1">
            {shoppinglist.articles.map((article, index) =>
              ((id: string) => (
                <Fragment key={id}>
                  <InputArticle
                    id={id}
                    name={"text"}
                    defaultValue={article.text}
                    className="flex-1"
                  />
                  <div
                    className="flex justify-center items-center "
                    ref={index === 0 ? rejigMenuAnchorElementRef : undefined}
                  >
                    <input
                      type="checkbox"
                      name="selected"
                      value={id}
                      className="mt-[0.05rem]"
                      form="article-selection"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setChecked(new Set(checked.add(e.target.value)));
                        } else {
                          checked.delete(e.target.value);
                          setChecked(new Set(checked));
                        }
                      }}
                      checked={checked.has(id)}
                      aria-label="Delete article"
                    />
                  </div>
                </Fragment>
              ))(article._id!.toString()),
            )}
            <Popover
              className={`fixed mt-[-35px]`}
              style={{
                left:
                  (rejigMenuAnchorElementRef.current?.getBoundingClientRect()
                    .left ?? 300) - 100,
              }}
            >
              {() => (
                <Transition
                  show={showRejig}
                  enter="transition-all duration-75"
                  enterFrom="opacity-0 scale-50"
                  enterTo="opacity-100 scale-100"
                  leave="transition-all duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-50"
                >
                  <Popover.Panel
                    static
                    className="bg-primary-2 p-2 shadow-xl border-2 border-primary-6 rounded-lg"
                  >
                    <Rejig />
                  </Popover.Panel>
                </Transition>
              )}
            </Popover>
          </div>
          <div className="mt-2 w-full flex items-center">
            <Plus />
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
      </RejigContextProvider>
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
                id="article-selection"
                action={async (formData) => {
                  return formData.get("_action") === "delete"
                    ? deleteArticles(formData).finally(() => {
                        setChecked(new Set());
                      })
                    : rejigArticles(formData).finally(() => {
                        setChecked(new Set());
                      });
                }}
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
                    <Backspace />
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
