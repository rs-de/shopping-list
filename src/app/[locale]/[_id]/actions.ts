"use server";
import { ShoppingListModel, isShoppingList } from "@/app/api/shoppinglist";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

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
    sl.save();
    revalidatePath("/[locale]/[_id]");
  }
}

export async function deleteArticles(form: FormData) {
  const idsToDelete = form.getAll("delete");

  await ShoppingListModel.findByIdAndUpdate(form.get("_id"), {
    $pull: { articles: { _id: { $in: idsToDelete } } },
  }).exec();

  if (idsToDelete.length > 0) {
    console.log("delete articles");
    revalidatePath("/[locale]/[_id]");
  }
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
