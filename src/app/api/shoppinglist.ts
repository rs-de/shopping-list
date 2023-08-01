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

const shoppingListSchema = new Schema(
  {
    articles: [articleSchema],
  },
  { timestamps: true },
);
export type ShoppingList = HydratedDocument<
  InferSchemaType<typeof shoppingListSchema>
>;

export const isShoppingList = (obj: unknown): obj is ShoppingList =>
  typeof obj === "object" && obj !== null && "_id" in obj && "articles" in obj;

export const ShoppingListModel =
  models?.["ShoppingList"] ??
  model<
    ShoppingList,
    Model<
      ShoppingList,
      {},
      { articles: Types.DocumentArray<ShoppingList["articles"]> }
    >
  >("ShoppingList", shoppingListSchema);

connect(process.env.MONGO_URI ?? "").catch((error) => console.error(error));
