import {
  ShoppingListDocument,
  ShoppingListModel,
} from "@/app/api/shoppinglist";
import { notFound } from "next/navigation";
import ShoppingListPage from "./ShoppingListPage";

export default async function ShoppingListPageSC({
  params: { _id },
}: {
  params: { _id: string };
}) {
  let sl: ShoppingListDocument | null;
  try {
    sl = await ShoppingListModel.findOne({ _id });
  } catch (error) {
    console.error(error);
    return notFound();
  }

  return (
    <ShoppingListPage
      shoppinglist={sl && JSON.parse(JSON.stringify(sl.toObject()))}
      shoppingListDoesNotExist={sl === null}
    />
  );
}

export async function generateMetadata({
  params: { _id },
}: {
  params: { _id: string };
}) {
  return {
    manifest: `/${_id}/manifest`,
  };
}
