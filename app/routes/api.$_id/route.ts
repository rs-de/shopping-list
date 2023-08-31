import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShoppingList } from "~/services/shoppinglist";
import { ShoppingListModel } from "~/services/shoppinglist";
import {
  addArticle,
  changeArticle,
  deleteArticles,
  rejigArticles,
  clearList,
} from "./actions";

export async function loader({ params }: LoaderArgs) {
  try {
    const sl = await ShoppingListModel.findOne({ _id: params._id });
    return json<ShoppingList | null>(sl && sl.toObject());
  } catch (error) {
    console.error(error);
    throw new Response(null, { status: 404 });
  }
}

export async function action({ request }: LoaderArgs) {
  const formData = await request.formData();
  switch (request.method) {
    case "PATCH":
      switch (formData.get("_action")) {
        case "addArticle": {
          return await addArticle(formData);
        }
        case "changeArticle": {
          return await changeArticle(formData);
        }
        case "deleteArticles": {
          return await deleteArticles(formData);
        }
        case "rejig": {
          return await rejigArticles(formData);
        }
        case "clearList": {
          return await clearList(formData);
        }
        default: {
          throw new Response(null, {
            status: 400,
            statusText: "unknown _action",
          });
        }
      }
    default:
      return new Response(null, { status: 405 });
  }
}
