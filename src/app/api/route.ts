import { NextRequest, NextResponse } from "next/server";
import { ShoppingListModel } from "./shoppinglist";

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip ?? "unknown";
    const count = await ShoppingListModel.countDocuments({ ip });
    if (count > 10) {
      console.error("Too many shopping lists");
      return NextResponse.json({}, { status: 400 });
    }

    const { _id } = (
      await ShoppingListModel.create({ ip, articles: [] })
    ).toJSON();
    return NextResponse.redirect(new URL(`/${_id}`, req.url), {
      status: 303,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL(`/`, req.url), { status: 303 });
  }
}
