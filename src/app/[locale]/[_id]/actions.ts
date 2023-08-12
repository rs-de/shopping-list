"use server";
import { ShoppingListModel, isShoppingList } from "@/app/api/shoppinglist";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { moveArticles } from "./moveArticles";

export async function updateShoppinglist(form: FormData) {
  let sl;
  sl = await ShoppingListModel.findOne({
    _id: form.get("_id")?.toString(),
  });
  if (!isShoppingList(sl)) {
    notFound();
  }
  const newArticleText = form.get("new");
  if (newArticleText && sl.articles.length < 150) {
    sl.articles.push({ text: newArticleText.toString() });
  }

  if (isShoppingList(sl) && sl.isModified()) {
    console.log("updated articles");
    await sl.save();
    revalidatePath("/[locale]/[_id]");
  }
}

export async function deleteArticles(form: FormData) {
  const idsToDelete = form.getAll("selected");

  await ShoppingListModel.findByIdAndUpdate(form.get("_id"), {
    $pull: { articles: { _id: { $in: idsToDelete } } },
  }).exec();

  if (idsToDelete.length > 0) {
    console.log("delete articles");
    revalidatePath("/[locale]/[_id]");
  }
}

export async function rejigArticles(form: FormData) {
  const partitionNumber = parseInt(String(form.get("partitionNumber")));
  let sl;
  const _id = form.get("_id");
  sl = await ShoppingListModel.findOne({ _id });
  if (!isShoppingList(sl)) {
    notFound();
  }
  //TODO: check typescript for FormData best practices
  const idsToRejig = form.getAll("selected") as string[];
  if (idsToRejig.length === 0) {
    return;
  }

  const rejiggedArticles = moveArticles({
    idsToRejig,
    partitionNumber,
    partitionCount: Number.parseInt(String(form.get("partitionCount"))),
    articles: sl.articles.toObject(),
  });

  await ShoppingListModel.findOneAndUpdate(
    { _id: _id },
    { $set: { articles: rejiggedArticles } },
  )
    .exec()
    .then(() => {
      console.log("rejigged articles");
      revalidatePath("/[locale]/[_id]");
    });
}

export async function saveArticleText({
  text,
  id,
}: {
  text: string;
  id: string;
}) {
  await ShoppingListModel.findOneAndUpdate(
    { "articles._id": id },
    { $set: { "articles.$.text": text } },
  ).exec();
}
