import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { ShoppingListDocument } from "~/services/shoppinglist";
import { ShoppingListModel } from "~/services/shoppinglist";

const appVersion = process.env.npm_package_version;

export async function loader({ params }: LoaderArgs) {
  let sl: ShoppingListDocument | null;
  sl = await ShoppingListModel.findById(params._id);

  return json({
    shoppingListVersion: sl?.updatedAt,
    appVersion,
  });
}
