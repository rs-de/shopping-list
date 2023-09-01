import type { FormEventHandler } from "react";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import Typography from "~/components/Typography";
import { ButtonPrimary, ButtonSecondary } from "~/components/Button";
import { api } from "~/store/api";
import { enqueueSnackbar } from "notistack";
import { getFormData } from "~/utils/getFormData";

export function useClearList({ _id }: { _id: string }) {
  const [dialog, setDialog] = React.useState(false);
  const { t } = useTranslation();
  const [patchShoppingList] = api.usePatchShoppingListMutation();

  const handleSubmit: FormEventHandler<HTMLFormElement> = React.useCallback(
    async (e) => {
      try {
        await patchShoppingList(getFormData(e));
      } catch (error) {
        console.error(error);
        enqueueSnackbar(t("system_error"), { variant: "error" });
      }
      setDialog(false);
    },
    [patchShoppingList, t],
  );

  return {
    clearList({ _id }: { _id: string }) {
      setDialog(true);
    },
    dialog: (
      <Transition show={dialog} as={React.Fragment}>
        <Dialog
          open={true}
          onClose={() => setDialog(false)}
          className="relative z-50"
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-primary-1/50" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-sm rounded-xl bg-primary-3 p-4">
                <Typography>
                  <Dialog.Title className="text-primary-11">
                    {t("clearList")}
                  </Dialog.Title>
                  <p>{t("clearList-confirm")}</p>
                </Typography>
                <form
                  method="post"
                  onSubmit={handleSubmit}
                  className="flex justify-end mt-4 gap-2"
                >
                  <input type="hidden" name="_id" value={_id} />
                  <ButtonSecondary
                    className="btn btn-primary-11"
                    onClick={() => setDialog(false)}
                    type="button"
                  >
                    {t("cancel")}
                  </ButtonSecondary>
                  <ButtonPrimary type="submit" name="_action" value="clearList">
                    {t("clearList")}
                  </ButtonPrimary>
                </form>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    ),
  };
}
