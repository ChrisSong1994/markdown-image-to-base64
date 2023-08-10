const fetch = require("node-fetch");

/**
 * 获取 markdown 中的 image 标签
 * @param {string} input
 */
function parseMarkdownImagesUrls(input) {
  const reg = /\!\[.*\]\((.*)\)/g;
  const matchs = [...input.matchAll(reg)];

  return matchs.map((m) => m[1]);
}

/**
 * 图片下载转base64
 *  @param {string} url
 */
async function imageUrlConvertToBase64(url) {
  const response = await fetch(url);
  const result = await response.arrayBuffer();
  const base64 = Buffer.from(result).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

module.exports = {
  parseMarkdownImagesUrls,
  imageUrlConvertToBase64,
};
