import {
  Schema,
  model,
  connect,
  models,
  InferSchemaType,
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

const articleSchema = new Schema({
  text: { type: String, required: true },
});

export type Article = InferSchemaType<typeof articleSchema> & { _id?: string };

const shoppingListSchema = new Schema(
  {
    articles: [articleSchema],
  },
  { timestamps: true },
);

export type ShoppingList = InferSchemaType<typeof shoppingListSchema> & {
  _id: string;
};
export type ShoppingListDocument = Omit<
  HydratedDocument<ShoppingList>,
  "toObject"
> & { toObject: () => ShoppingList };

export const isShoppingList = (obj: unknown): obj is ShoppingListDocument =>
  typeof obj === "object" && obj !== null && "_id" in obj && "articles" in obj;

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
