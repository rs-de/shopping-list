import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { ShoppingListModel } from "~/services/shoppinglist";

export async function loader() {
  throw new Response(null, { status: 405 });
}

export default () => null;

export async function action({ request }: ActionArgs) {
  switch (request.method) {
    case "PATCH": {
      const formData = await request.formData();
      await ShoppingListModel.findOneAndUpdate(
        { "articles._id": formData.get("_id") },
        { $set: { "articles.$.text": formData.get("text") } },
      ).exec();
      return json({});
    }
    default: {
      return new Response(null, { status: 405 });
    }
  }
}

export { ErrorBoundary } from "./$";
