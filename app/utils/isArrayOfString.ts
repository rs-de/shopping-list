export function isArrayOfString(value: any): value is string[] {
  return (
    Array.isArray(value) && (value.length === 0 || typeof value[0] === "string")
  );
}
