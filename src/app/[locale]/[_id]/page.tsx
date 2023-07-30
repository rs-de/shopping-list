import { ShoppingList, ShoppingListModel } from "@/app/api/shoppinglist";
import { notFound } from "next/navigation";
import InputArticle from "./InputArticle";
import { MdOutlineAdd } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
import Typography from "@/components/Typography";
import { useTranslations } from "next-intl";
import { ButtonPrimary } from "@/components/Button";
import { deleteArticles, updateShoppinglist } from "./actions";

export default async function ShoppingListPageSC({
  params: { _id },
}: {
  params: { _id: string };
}) {
  let sl: ShoppingList | null;
  try {
    sl = await ShoppingListModel.findOne({ _id });
    if (!sl) {
      notFound();
    }
  } catch (error) {
    console.error(error);
    notFound();
  }

  return <ShoppingListPage shoppinglist={sl} />;
}

function ShoppingListPage({ shoppinglist }: { shoppinglist: ShoppingList }) {
  const t = useTranslations();
  const listId = shoppinglist._id.toString();
  return (
    <Typography className="flex flex-col items-center">
      <h1 className="text-primary-11">{t("shoppinglist-articles")}</h1>
      <form id="delete" action={deleteArticles}>
        <input type="hidden" name="_id" value={listId} />
      </form>
      <form id="text" action={updateShoppinglist} className="w-full">
        <input type="hidden" name="_id" value={listId} />
        <div className="grid grid-cols-[1fr_75px]">
          <div>
            {shoppinglist.articles.map((article) =>
              ((id: string) => (
                <div key={id} className="w-full my-1 flex gap-1">
                  <InputArticle
                    id={id}
                    name={"text"}
                    options={[]}
                    defaultValue={article.text}
                    className="flex-1"
                  />
                  <label className="flex gap-1 pt-3">
                    <FiDelete />
                    <input
                      type="checkbox"
                      name="delete"
                      value={id}
                      className="mt-[0.05rem]"
                      form="delete"
                    />
                  </label>
                </div>
              ))(article._id!.toString()),
            )}
          </div>
          {shoppinglist.articles.length > 0 && (
            <div className="flex justify-center">
              <ButtonPrimary
                form="delete"
                type="submit"
                name="_action"
                value="delete"
              >
                <FiDelete />
              </ButtonPrimary>
            </div>
          )}
        </div>
        <div className="mt-2 w-full flex items-center">
          <MdOutlineAdd />
          <InputArticle
            className="flex-1"
            name={"new"}
            options={[]}
            key={shoppinglist.articles.length}
          />
        </div>
        <ButtonPrimary
          type="submit"
          name="_action"
          value="save"
          className="w-full mt-2"
        >
          {t("Add")}
        </ButtonPrimary>
      </form>
    </Typography>
  );
}
