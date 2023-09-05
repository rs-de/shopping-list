import { ShoppingListModel } from "~/services/shoppinglist";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import i18next from "~/i18next.server";

export async function loader({ request, params: { _id } }: LoaderArgs) {
  const t = await i18next.getFixedT(request);
  const sl = await ShoppingListModel.findOne({ _id });
  if (!sl) {
    throw new Response(null, { status: 404 });
  }

  return json({
    name: t("page-title"),
    short_name: t("ShoppingList"),
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
