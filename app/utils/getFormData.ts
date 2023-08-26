// responsible submit button's name and value is missing in formdata
// we have to add it ...
export function getFormData(e: React.FormEvent<HTMLFormElement>) {
  let formData = new FormData(e.currentTarget);
  //@ts-ignore
  let { name, value } = e.nativeEvent.submitter ?? {};
  name && value && formData.append(name, value);
  return formData;
}
