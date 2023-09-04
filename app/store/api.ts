import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { moveArticles } from "~/utils/moveArticles";
import type { Article, ShoppingList } from "~/services/shoppinglist";
import { isArrayOfString } from "~/utils/isArrayOfString";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const baseUrl = "/api";
const baseQuery = fetchBaseQuery({
  baseUrl,
  headers: { accept: "application/json" },
});

let shoppingListSyncInterval: ReturnType<typeof setInterval> | null = null;

export const api = createApi({
  baseQuery,
  refetchOnFocus: true,
  tagTypes: ["ShoppingList"],
  endpoints: (builder) => ({
    postShoppingList: builder.mutation<ShoppingList, void>({
      query: () => ({
        url: ``,
        method: "POST",
      }),
      invalidatesTags: [{ type: "ShoppingList", id: "LISTS" }],
    }),
    getShoppingList: builder.query<ShoppingList | null, { _id: string }>({
      query: ({ _id }) => ({
        url: `/${encodeURIComponent(_id)}`,
      }),
      providesTags: (_, __, { _id }) => [{ type: "ShoppingList", id: _id }],
    }),
    patchShoppingList: builder.mutation<ShoppingList, FormData>({
      query: (formData) => ({
        url: `/${encodeURIComponent(String(formData.get("_id")))}`,
        method: "PATCH",
        body: formData,
        formData: true,
      }),
      onQueryStarted(formData, { dispatch, queryFulfilled, getState }) {
        let _id = String(formData.get("_id"));
        dispatch(
          api.util.updateQueryData("getShoppingList", { _id }, (draft) => {
            //optimistic updates on draft shoppingList
            draft && patchShoppingList({ shoppingList: draft, formData });
          }),
        );
        //If a request fails, we can not be sure about consistency anymore.
        //Best is, to treat the local state as leading and sync the server state with it.
        queryFulfilled.catch(() => {
          if (shoppingListSyncInterval) {
            clearInterval(shoppingListSyncInterval);
          }
          shoppingListSyncInterval = setInterval(() => {
            let { data: shoppingList } = api.endpoints.getShoppingList.select({
              _id,
            })(getState());
            shoppingList &&
              dispatch(api.endpoints.putShoppingList.initiate(shoppingList));
          }, 1000);
        });
      },
    }),
    putShoppingList: builder.mutation<{}, ShoppingList>({
      query: (shoppingList) => ({
        url: `/${encodeURIComponent(String(shoppingList._id))}`,
        method: "PUT",
        body: shoppingList,
      }),
      invalidatesTags: (result, error, shoppingList) => {
        if (!error) {
          clearInterval(shoppingListSyncInterval!);
          return [{ type: "ShoppingList", id: shoppingList._id }];
        }
        return [];
      },
    }),
    deleteShoppingList: builder.mutation<void, { _id: string }>({
      query: ({ _id }) => ({
        url: `/${encodeURIComponent(_id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: "ShoppingList", id: _id },
      ],
    }),
    patchArticle: builder.mutation<Article, FormData>({
      query: (formData) => ({
        url: `/${encodeURIComponent(String(formData.get("_id")))}}`,
        method: "PATCH",
        body: formData,
        formData: true,
      }),
    }),
    getVersions: builder.query<
      { shoppingListVersion: string; appVersion: string },
      { listId: string }
    >({
      query: ({ listId }) => ({
        url: `/${encodeURIComponent(listId)}/versions`,
      }),
    }),
  }),
});

//optimistic updates on draft shoppingList
export function patchShoppingList({ shoppingList, formData }: PatchArg) {
  switch (formData.get("_action")) {
    case "deleteArticles": {
      return (shoppingList.articles = shoppingList.articles.filter(
        (article) => !formData.getAll("selected").includes(article.id ?? ""),
      ));
    }
    case "rejig": {
      let { partitionCount, partitionNumber } = Object.fromEntries(formData);
      let selected = formData.getAll("selected");
      if (!isArrayOfString(selected)) {
        throw new Error("selected must be an array of strings");
      }

      return (shoppingList.articles = moveArticles({
        partitionCount: +partitionCount,
        partitionNumber: +partitionNumber,
        articles: shoppingList.articles,
        idsToRejig: selected,
      }));
    }
    case "addArticle": {
      shoppingList.articles.push({
        text: String(formData.get("new")),
        id: String(formData.get("id")),
      });
      return;
    }
    case "changeArticle": {
      let article: Article | undefined = shoppingList.articles.find(
        (article) => article.id === formData.get("id"),
      );
      if (article) article.text = String(formData.get("text"));
      return;
    }
    case "clearList": {
      shoppingList.articles = [];
      return;
    }
    default:
      return;
  }
}

export type PatchArg = {
  shoppingList: ShoppingList;
  formData: FormData;
};

export function isFetchBaseQueryError(
  error: any,
): error is FetchBaseQueryError {
  return Boolean(error?.status);
}

//this is not an exception, network errors are expected
export function isFetchError(error: any): error is FetchBaseQueryError {
  return error?.status === "FETCH_ERROR" || error?.status === "TIMEOUT_ERROR";
}
