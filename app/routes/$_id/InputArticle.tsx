"use client";
import type { ChangeEventHandler, ComponentProps } from "react";
import React from "react";
import { useDebounceCallback } from "@react-hook/debounce";
import { api } from "~/store/api";

export default function InputArticle({
  name,
  id = name,
  listId,
  className,
  ...rest
}: InputArticleProps) {
  const [changeText] = api.usePatchArticleMutation();
  const onChange = useDebounceCallback(
    React.useCallback<ChangeEventHandler<HTMLInputElement>>(
      async (e) => {
        //no action, if no id is given (e.g. new article)
        if (id === name) return;

        const formData = new FormData();
        formData.append("_action", "changeArticle");
        formData.append("_id", listId);
        formData.append("text", e.target.value);
        formData.append("id", id);
        await changeText(formData).unwrap();
      },
      [changeText, id, listId, name],
    ),
    750,
  );

  return (
    <input
      onChange={onChange}
      className={`rounded-md w-full bg-slate-3 ${className}`}
      name={name}
      maxLength={75}
      enterKeyHint="enter"
      aria-label={"Article text"}
      autoComplete="off"
      {...rest}
    />
  );
}

type InputArticleProps = ComponentProps<"input"> & {
  name: string;
  listId: string;
};
