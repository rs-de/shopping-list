import { ShoppingListModel } from "@/app/api/shoppinglist";
import { notFound, useParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { _id, locale } }: { params: { locale: string; _id: string } },
) {
  const sl = await ShoppingListModel.findOne({ _id });
  if (!sl) {
    return notFound();
  }

  return NextResponse.json({
    name: "Shopping List 4Free",
    short_name: "SL4free",
    theme_color: "#3b82f6",
    background_color: "#3D4849",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    start_url: `/${_id}`,
    icons: [
      {
        src: "/icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  });
}
