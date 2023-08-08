"use client";
import { ChangeEventHandler, ComponentProps, useCallback } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { useDebounceCallback } from "@react-hook/debounce";
import { saveArticleText } from "./actions";

export default function InputArticle({
  name,
  id = name,
  disabled = false,
  defaultValue,
}: ComponentProps<"input"> & { ariaLabel?: string; name: string }) {
  const { pending } = useFormStatus();
  const { onChange } = useInputValue({ name, id });
  return (
    <input
      onChange={onChange}
      defaultValue={defaultValue}
      className="rounded-md w-full bg-slate-3"
      name={name}
      maxLength={75}
      enterKeyHint="enter"
      autoFocus
      disabled={disabled || pending}
      aria-label={"Article"}
    />
  );
}

function useInputValue({ name, id }: UseInputValueProps) {
  const save = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      async function save() {
        console.log("save");
        await saveArticleText({ id, text: e.target.value });
      }

      if (e) {
        save();
      }
    },
    [id],
  );
  const onChange = useDebounceCallback(save, 500);

  if (name === id) {
    //no id, keep input uncontrolled
    return {};
  }

  return { onChange };
}

type UseInputValueProps = {
  name: string;
  id: string;
};

function handleOnChange() {}
