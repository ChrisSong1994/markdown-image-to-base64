import require$$0$1 from 'signale';
import require$$1 from 'path';
import require$$2 from 'node:fs/promises';
import require$$3 from 'node:events';
import require$$0 from 'node-fetch';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

const fetch = require$$0;

/**
 * 获取 markdown 中的 image 标签
 * @param {string} input
 */
function parseMarkdownImagesUrls$1(input, filter) {
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
async function imageUrlConvertToBase64$1(url,quality) {
  const response = await fetch(url);
  const result = await response.arrayBuffer();
  const base64 = Buffer.from(result).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

var utils = {
  parseMarkdownImagesUrls: parseMarkdownImagesUrls$1,
  imageUrlConvertToBase64: imageUrlConvertToBase64$1,
};

const signale = require$$0$1;
const path = require$$1;
const fs = require$$2;
const { EventEmitter } = require$$3;

const {
  parseMarkdownImagesUrls,
  imageUrlConvertToBase64,
} = utils;

const cwd = process.cwd();
/**
 * 参数
 * input 输入文件
 * output 输出文件
 * options
 * * quality 图片压缩比
 * * filter  正则匹配，默认匹配全部图片
 * 日志
 */
class MarkdownImageToBase64 extends EventEmitter {
  constructor(props) {
    super();
    const { input, output, quality = 1, filter } = props;
    this.imgUrlMap = new Map(); // url 和 base64 对应
    this.inputPath = path.isAbsolute(input) ? input : path.join(cwd, input);
    this.outputPath = path.isAbsolute(output) ? output : path.join(cwd, output);
    this.quality = quality;
    this.filter = filter;
  }

  async run() {
    signale.info("开始处理");
    // 1、解析input 获取需要转换的图片地址,存放起来
    await this.parse();
    // 2、处理图片，下载、转换、存放
    await this.convert();
    // 3、替换图片资源，放入到output
    await this.generate();

    signale.complete("处理完成");
  }

  async parse() {
    signale.pending("图片地址解析...");
    this.input = await fs.readFile(this.inputPath, { encoding: "utf8" });
    const matchedUrls = parseMarkdownImagesUrls(this.input, this.filter);
    matchedUrls.forEach((url) => this.imgUrlMap.set(url, null));
  }

  async convert() {
    signale.pending("图片地址转换...");
    for (const url of this.imgUrlMap.keys()) {
      const base64 = await imageUrlConvertToBase64(url, this.quality);
      this.imgUrlMap.set(url, base64);
    }
  }

  async generate() {
    signale.pending("图片地址替换...");
    let output = this.input;
    for (const url of this.imgUrlMap.keys()) {
      const base64 = this.imgUrlMap.get(url);
      if (base64) {
        output = output.replaceAll(url, base64);
      }
    }
    await fs.writeFile(this.outputPath, output, { encoding: "utf8" });
  }
}

var markdownImageToBase64 = MarkdownImageToBase64;

var index = /*@__PURE__*/getDefaultExportFromCjs(markdownImageToBase64);

export { index as default };
