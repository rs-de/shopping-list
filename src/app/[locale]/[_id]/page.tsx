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
    if (!sl) {
      notFound();
    }
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <ShoppingListPage
      shoppinglist={JSON.parse(JSON.stringify(sl.toObject()))}
    />
  );
}

export async function generateMetadata({
  params: { _id, locale },
}: {
  params: { _id: string; locale: string };
}) {
  return {
    manifest: `/${_id}/manifest`,
  };
}
