import type { ShoppingListDocument } from "~/services/shoppinglist";
import { ShoppingListModel } from "~/services/shoppinglist";
import { moveArticles } from "../../utils/moveArticles";
import { json } from "@remix-run/node";
import { isArrayOfString } from "~/utils/isArrayOfString";

export async function addArticle(form: FormData) {
  if (!form.has("_id")) {
    throw new Response(null, { status: 400, statusText: "no _id" });
  }
  if (!form.has("new")) {
    throw new Response(null, { status: 400, statusText: "no new text" });
  }

  let sl = await ShoppingListModel.findByIdAndUpdate(
    form.get("_id"),
    {
      $push: { articles: { text: form.get("new")?.toString().trim() } },
    },
    { new: true },
  ).exec();

  if (sl === null) {
    throw new Response(null, {
      status: 400,
      statusText: "no shopping list found",
    });
  }
  return json(sl.toObject());
}

export async function deleteArticles(form: FormData) {
  let idsToDelete = form.getAll("selected");
  if (!isArrayOfString(idsToDelete)) {
    throw new Response(null, {
      status: 400,
      statusText: "selected is not an array of strings",
    });
  }

  await ShoppingListModel.findByIdAndUpdate(form.get("_id"), {
    $pull: { articles: { _id: { $in: idsToDelete } } },
  }).exec();

  if (idsToDelete.length > 0) {
    console.log("deleteArticles");
  }
  return new Response(null, { status: 200 });
}

export async function rejigArticles(form: FormData) {
  let { _id, partitionCount, partitionNumber } = Object.fromEntries(form);
  let selected = form.getAll("selected");

  if (!isArrayOfString(selected)) {
    throw new Response(null, {
      status: 400,
      statusText: "selected is not an array of strings",
    });
  }

  let idsToRejig = selected;
  if (idsToRejig.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: "no articles selected",
    });
  }

  let sl = await ShoppingListModel.findOne({ _id });
  if (sl === null) {
    throw new Response(null, {
      status: 400,
      statusText: "no shopping list found",
    });
  }

  let rejiggedArticles = moveArticles({
    idsToRejig,
    partitionNumber: +partitionNumber,
    partitionCount: +partitionCount,
    articles: sl.articles,
  });

  return (await ShoppingListModel.findOneAndUpdate(
    { _id },
    { $set: { articles: rejiggedArticles } },
    { new: true },
  ).exec()) as ShoppingListDocument | null;
}
