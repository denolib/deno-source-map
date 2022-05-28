import * as fs from "https://deno.land/std@0.140.0/node/fs.ts";
import * as path from "https://deno.land/std@0.140.0/node/path.ts";

let readWasm;
let initialize;

if (typeof fetch === "function") {
  // Web version of reading a wasm file into an array buffer.

  let mappingsWasmUrl = null;

  readWasm = function () {
    if (typeof mappingsWasmUrl !== "string") {
      throw new Error(
        "You must provide the URL of lib/mappings.wasm by calling " +
          "SourceMapConsumer.initialize({ 'lib/mappings.wasm': ... }) " +
          "before using SourceMapConsumer",
      );
    }

    return fetch(mappingsWasmUrl)
      .then((response) => response.arrayBuffer());
  };

  initialize = (url) => mappingsWasmUrl = url;
} else {
  // Node version of reading a wasm file into an array buffer.
  readWasm = function () {
    return new Promise((resolve, reject) => {
      const wasmPath = path.join(Deno.cwd(), "mappings.wasm");
      fs.readFile(wasmPath, null, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(data.buffer);
      });
    });
  };

  // eslint-disable-next-line no-unused-vars
  initialize = (_) => {
    console.debug(
      "SourceMapConsumer.initialize is a no-op when running in node.js",
    );
  };
}

export { readWasm, initialize };
