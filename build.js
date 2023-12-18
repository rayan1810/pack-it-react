import path from "path";
import fs from "fs";

// NodeJS Build
const NODE_FIX =
  '#!/usr/bin/env node\n\nimport { createRequire as createImportMetaRequire } from "module"; import.meta.require ||= (id) => createImportMetaRequire(import.meta.url)(id);\n';
const BUILD_DIR = "build";
const nodeBuild = await Bun.build({
  entrypoints: ["./index.ts"],
  target: "node",
  minify: true,
  naming: "[dir]/[name].[ext]",
});

// Write output files
for (const result of nodeBuild.outputs) {
  const fileContent = NODE_FIX + (await result.text());
  const destDir = path.join(import.meta.dir, BUILD_DIR);
  const dest = path.join(destDir, result.path);
  fs.existsSync(destDir) || fs.mkdirSync(destDir);
  Bun.write(dest, fileContent);
}
