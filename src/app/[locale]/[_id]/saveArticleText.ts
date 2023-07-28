"use server";
import { ShoppingListModel } from "@/app/api/shoppinglist";

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
