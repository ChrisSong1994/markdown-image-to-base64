# markdown-image-to-base64

转换 markdown 中的图片为 base64,解决雨雀或其他网站导出 markdown 文件内图片防盗链问题

## API

- `input`: 输入文件
- `output`: 输出文件
- `quality`: 是否针对图片做压缩处理，压缩比例
- `filter`: 匹配需要做图片处理正则，默认全部处理（包含相对路径和绝对路径）
