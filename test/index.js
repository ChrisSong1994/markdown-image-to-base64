const MarkdownImageToBase64 = require("../lib/index.js");

const markdownImageToBase64 = new MarkdownImageToBase64({
  input: "./input.md",
  output: "./output.md",
  filter: /.*nlark.*/,
});

markdownImageToBase64.run();
