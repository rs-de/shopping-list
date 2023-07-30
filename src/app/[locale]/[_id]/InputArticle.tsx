"use client";
import { UseAutocompleteProps, useAutocomplete } from "@mui/base";
import { SyntheticEvent, useCallback } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { useDebounceCallback } from "@react-hook/debounce";
import { saveArticleText } from "./actions";

export default function InputArticle({
  name,
  id = name,
  disableClearable = false,
  disabled = false,
  readOnly = false,
  freeSolo = true,
  className = "",
  ...rest
}: UseAutocompleteProps<string, false, false, true> & {
  className?: string;
  name: string;
}) {
  const { getInputProps, getRootProps, focused } = useAutocomplete({
    value: undefined,
    id,
    freeSolo,
    ...useInputValue({ name, id }),
    ...rest,
  });
  const { pending } = useFormStatus();

  return (
    <div {...{ ...getRootProps(), className }}>
      <input
        {...getInputProps()}
        className="rounded-md w-full bg-slate-3"
        name={name}
        maxLength={75}
        enterKeyHint="enter"
        autoFocus
        disabled={disabled || pending}
      />
    </div>
  );
}

function useInputValue({ name, id }: UseInputValueProps) {
  const save = useCallback(
    (e: SyntheticEvent, text: string) => {
      async function save() {
        console.log("save");
        await saveArticleText({ id, text });
      }
      if (e) {
        save();
      }
    },
    [id],
  );
  const onInputChange = useDebounceCallback(save, 500);

  if (name === id) {
    //no id, keep input uncontrolled
    return {};
  }

  return { onInputChange };
}

type UseInputValueProps = {
  name: string;
  id: string;
};

function handleOnChange() {}
