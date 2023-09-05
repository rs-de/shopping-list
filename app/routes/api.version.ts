import { json } from "@remix-run/server-runtime";

import packageJson from "../../package.json";
let version = packageJson.version;

export async function loader() {
  return json({
    version,
  });
}
