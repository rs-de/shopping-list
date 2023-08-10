import {
  ShoppingListDocument,
  ShoppingListModel,
} from "@/app/api/shoppinglist";
import { NextResponse } from "next/server";
const appVersion = process.env.npm_package_version;

export async function GET(
  _: Request,
  { params: { _id } }: { params: { _id: string } },
) {
  let sl: ShoppingListDocument | null;
  sl = await ShoppingListModel.findById(_id);

  return NextResponse.json({
    shoppingListVersion: sl?.updatedAt,
    appVersion,
  });
}
