import type { InferSchemaType, HydratedDocument, Model } from "mongoose";
import { Schema, model, connect, models, Types } from "mongoose";

const articleSchema = new Schema({
  text: { type: String, required: true },
});

export type Article = InferSchemaType<typeof articleSchema> & { _id?: string };

const shoppingListSchema = new Schema(
  {
    articles: {
      type: [articleSchema],
      validate: [
        (articles: Article[]) => articles.length <= 200,
        "ARTICLE_COUNT_EXCEEDED",
      ],
    },
  },
  { timestamps: true },
);

export type ShoppingList = Omit<
  InferSchemaType<typeof shoppingListSchema>,
  "articles"
> & {
  _id?: string;
  articles: Article[];
};
export type ShoppingListDocument = HydratedDocument<ShoppingList>;

export const isShoppingList = (obj: any): obj is ShoppingList =>
  typeof obj?._id === "string";

export const isShoppingListDocument = (obj: any): obj is ShoppingListDocument =>
  obj?._id instanceof Types.ObjectId;

export const ShoppingListModel =
  models?.["ShoppingList"] ??
  model<
    ShoppingListDocument,
    Model<
      ShoppingListDocument,
      {},
      { articles: Types.DocumentArray<ShoppingListDocument["articles"]> }
    >
  >("ShoppingList", shoppingListSchema);

connect(process.env.MONGO_URI ?? "").catch((error) => console.error(error));
