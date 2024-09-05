import * as esbuild from "esbuild";
/**
 * Web application
 */
import * as fs from "fs";
import * as path from "path";

import esbuildPluginTsc from "esbuild-plugin-tsc";
import { readFile } from "fs/promises";

const packageJson = JSON.parse(
  await readFile(new URL("package.json", import.meta.url))
);

const sharedConfig = {
  entryPoints: ["src/extension/index.ts"],
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
let cjs = await esbuild.context({
  ...sharedConfig,
  platform: "node", // for CJS
  outfile: "dist/index.js",
});

await cjs.watch();

let esm = await esbuild.context({
  ...sharedConfig,
  outfile: "dist/index.esm.js",
  platform: "neutral", // for ESM
  format: "esm",
});

await esm.watch();

// Bg consumer
let consumer = await esbuild.context({
  entryPoints: ["src/extension/bg-consumer.ts"],
  outfile: "dist/bg-consumer.js",
  bundle: true,
  minify: true,
  platform: "node", // for CJS
  format: "iife",
});

await consumer.watch();

// For web
const syncBlobPlugin = () => ({
  name: "sync-blob-plugin",
  setup(build) {
    build.onResolve(
      { filter: /worker\/[a-zA-Z0-9_-]+\.worker\.js$/ },
      (args) => {
        return {
          path: path.join(process.cwd(), "dist/web-application", args.path),
          namespace: "sync-blob",
        };
      }
    );

    // Load and compile the TypeScript file, then convert it to a Blob URL
    build.onLoad(
      { filter: /worker\/[a-zA-Z0-9_-]+\.worker\.js$/, namespace: "sync-blob" },
      async (args) => {
        const file = fs.readFileSync(path.join(args.path), "utf8");

        const compiledJs = esbuild.transformSync(file, {
          loader: "js",
        });

        // Return the compiled JavaScript as a Blob URL
        return {
          contents: `
          const blob = new Blob([\`${compiledJs.code.replace(
            /`/g,
            "\\`"
          )}\`], { type: 'application/javascript' });
          export default URL.createObjectURL(blob);
        `,
          loader: "js",
        };
      }
    );
  },
});

let webApplication = await esbuild.context({
  entryPoints: ["src/web-application/index.ts"],
  outfile: "dist/web-application/index.js",
  bundle: true,
  minify: true,
  format: "esm",
  external: Object.keys(packageJson["dependencies"]).concat(
    Object.keys(packageJson.peerDependencies)
  ),
  plugins: [
    syncBlobPlugin(),
    esbuildPluginTsc({
      force: true,
    }),
  ],
});

await webApplication.watch({});
