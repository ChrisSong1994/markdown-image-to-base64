const signale = require("signale");
const path = require("path");
const fs = require("node:fs/promises");
const { EventEmitter } = require("node:events");

const {
  parseMarkdownImagesUrls,
  imageUrlConvertToBase64,
} = require("./utils.js");

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

module.exports = MarkdownImageToBase64;
