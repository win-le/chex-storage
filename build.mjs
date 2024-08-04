import * as esbuild from "esbuild";

import esbuildPluginTsc from "esbuild-plugin-tsc";
import { readFile } from "fs/promises";

const packageJson = JSON.parse(
  await readFile(new URL("package.json", import.meta.url))
);

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  external: Object.keys(packageJson["dependencies"]).concat(
    Object.keys(packageJson.peerDependencies)
  ),
  plugins: [
    esbuildPluginTsc({
      force: true,
    }),
  ],
};

await esbuild.context({
  ...sharedConfig,
  platform: "node", // for CJS
  outfile: "dist/index.js",
});

await esbuild.context({
  ...sharedConfig,
  outfile: "dist/index.esm.js",
  platform: "neutral", // for ESM
  format: "esm",
});
