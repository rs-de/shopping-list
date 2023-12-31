import { useNavigate, useParams } from "@remix-run/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { ClientOnly } from "remix-utils";
import { ButtonPrimary, ButtonSecondary } from "~/components/Button";
import { Spinner } from "~/components/Spinner";
import TextShadow from "~/components/TextShadow";
import Typography from "~/components/Typography";
import { LOCAL_STORAGE_KEY } from "~/constants";
import { api, isFetchError } from "~/store/api";
import { RejigContextProvider } from "./RejigContext";
import InputArticle from "./InputArticle";
import { Popover, Transition } from "@headlessui/react";
import { Plus, Backspace } from "heroicons-react";
import ButtonShare from "~/components/ButtonShare";
import Rejig from "./Rejig";
import { getFormData } from "~/utils/getFormData";
import type { V2_MetaFunction } from "@remix-run/node";
import { nanoid } from "nanoid";
import { useClearList } from "./ClearList/useClearList";

export const meta: V2_MetaFunction = ({ params: { _id }, matches }) => {
  const parentMeta = matches
    //@ts-ignore ts(2339)
    .flatMap((match) => match.meta ?? [])
    .filter((meta) => !("manifest" in meta));
  return [
    { tagName: "link", rel: "manifest", href: `/${_id}/manifest` },
    ...parentMeta,
  ];
};

function Shoppinglist() {
  const { _id = "" } = useParams();
  const {
    data: shoppingList,
    refetch,
    error,
  } = api.useGetShoppingListQuery({ _id }, { skip: !_id });
  const [patchShoppingList] = api.usePatchShoppingListMutation();
  const { t } = useTranslation();
  const listId = shoppingList?._id;
  const [checked, setChecked] = React.useState(new Set());
  const showDelete = checked.size > 0;
  const showRejig =
    checked.size > 0 && (shoppingList?.articles.length ?? 0) > 5;
  const navigate = useNavigate();
  const { clearList, dialog } = useClearList({ _id });

  //save list id to local storage
  React.useEffect(() => {
    listId && localStorage.setItem(LOCAL_STORAGE_KEY, listId);
  }, [listId]);
  //remove list id from local storage, if list does not exist
  React.useEffect(() => {
    shoppingList === null && localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, [shoppingList]);
  //redirect to home page, if list does not exist
  React.useEffect(() => {
    if (shoppingList === null) {
      navigate("/");
    }
  }, [shoppingList, navigate]);

  const rejigMenuAnchorElementRef = React.useRef<HTMLDivElement>(null);

  const [autoFocus, setAutoFocus] = React.useState<string>("new");

  if (error && !isFetchError(error)) {
    return (
      <Typography className="flex-1 flex flex-col items-center p-4">
        <div className="border border-yellow-8 rounded-lg p-2 bg-yellow-4 mb-4">
          {t("service_error")}
        </div>
        <ButtonPrimary type="button" onClick={() => refetch()}>
          {t("reload")}
        </ButtonPrimary>
      </Typography>
    );
  }

  return !shoppingList || !listId ? (
    <Spinner />
  ) : (
    <Typography className="flex-1 flex flex-col items-center p-4">
      {dialog}
      <TextShadow>
        <h1 className="text-primary-11">{t("shoppinglist-articles")}</h1>
      </TextShadow>
      <RejigContextProvider>
        <div className="w-full bg-primary-2/80 p-2 rounded-xl">
          <div className="w-full grid grid-cols-[1fr_50px] gap-1 [overflow-anchor:none]">
            {shoppingList.articles.map((article, index) => (
              <React.Fragment key={article.id}>
                <InputArticle
                  id={article.id}
                  name={"text"}
                  defaultValue={article.text}
                  className="flex-1"
                  listId={listId}
                />
                <div
                  className="flex justify-center items-center "
                  ref={index === 0 ? rejigMenuAnchorElementRef : undefined}
                >
                  <input
                    type="checkbox"
                    name="selected"
                    value={article.id}
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
                    checked={checked.has(article.id)}
                    aria-label="Delete article"
                    onClick={() => setAutoFocus(`selected-${index}`)}
                    autoFocus={autoFocus === `selected-${index}`}
                  />
                </div>
              </React.Fragment>
            ))}
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
          <form
            method="post"
            id="text"
            onSubmit={async (e) => {
              try {
                e.preventDefault();
                let formData = getFormData(e);
                if (
                  formData.get("_action") === "addArticle" &&
                  !formData.get("new")
                ) {
                  return;
                } else if (formData.get("_action") === "clearList") {
                  clearList({ _id });
                  return;
                }
                await patchShoppingList(formData);
              } catch (error) {
                console.warn(error);
              }
            }}
          >
            <input type="hidden" name="_id" value={listId} />
            <input type="hidden" name="id" value={nanoid(6)} />
            <div className="mt-2 w-full flex items-center">
              <Plus />
              <InputArticle
                className="flex-1"
                name={"new"}
                key={shoppingList.articles.length}
                aria-label={t("input_article_to_add")}
                listId={listId}
                autoFocus={autoFocus === "new"}
                onFocus={() => setAutoFocus("new")}
              />
            </div>
            <div className="w-full mt-2 flex gap-2">
              <ButtonPrimary
                type="submit"
                name="_action"
                value="addArticle"
                className="flex-1"
              >
                {t("Add")}
              </ButtonPrimary>
              {shoppingList.articles.length > 0 && (
                <ButtonSecondary type="submit" name="_action" value="clearList">
                  {t("clearList")}
                </ButtonSecondary>
              )}
              <ButtonShare />
            </div>
          </form>
        </div>
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
                method="post"
                id="article-selection"
                onSubmit={(e) => {
                  try {
                    e.preventDefault();
                    //no wait for response, because we do not want to block the UI
                    patchShoppingList(getFormData(e));
                    setChecked(new Set());
                  } catch (error) {
                    console.warn(error);
                  }
                }}
                className="w-full p-8"
              >
                <input type="hidden" name="_id" value={listId} />
                <div className="flex justify-center">
                  <ButtonPrimary
                    type="submit"
                    name="_action"
                    value="deleteArticles"
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

export default function ShoppingListSC() {
  return (
    <ClientOnly fallback={<Spinner />}>{() => <Shoppinglist />}</ClientOnly>
  );
}

export { ErrorBoundary } from "../$";
