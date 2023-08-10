const { defineConfig } = require("rollup");
const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");

module.exports = defineConfig({
  input: "index.js",
  output: [
    {
      format: "cjs",
      file: "./lib/index.js",
    },
    {
      format: "esm",
      file: "./esm/index.js",
    },
  ],
  plugins: [json(), commonjs()],
});
