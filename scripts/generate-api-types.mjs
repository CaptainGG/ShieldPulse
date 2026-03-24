import { execSync } from "node:child_process";

const output = "src/lib/api-schema.ts";
const source = process.env.ORACLE_OPENAPI_URL ?? "http://127.0.0.1:8000/openapi.json";

execSync(`npx openapi-typescript ${source} -o ${output}`, {
  cwd: new URL("../apps/web/", import.meta.url),
  stdio: "inherit"
});
