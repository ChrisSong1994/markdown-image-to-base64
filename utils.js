const fetch = require("node-fetch");

/**
 * 获取 markdown 中的 image 标签
 * @param {string} input
 */
function parseMarkdownImagesUrls(input, filter) {
  const reg = /\!\[.*\]\((.*)\)/g;
  const matchs = [...input.matchAll(reg)];
  let urls = matchs.map((m) => m[1]).filter((url) => url.startsWith("http")); // 过滤掉 base64 和 相对路径

  if (filter) {
    urls = urls.filter((url) => filter.test(url));
  }

  return urls;
}

/**
 * 图片下载转base64
 *  @param {string} url
 *  @param {number} quality // 图片压缩比
 */
async function imageUrlConvertToBase64(url,quality) {
  const response = await fetch(url);
  const result = await response.arrayBuffer();
  const base64 = Buffer.from(result).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

module.exports = {
  parseMarkdownImagesUrls,
  imageUrlConvertToBase64,
};
