```
实现目的：
mpa脚手架，为了方便页面抽离，方便日后重新自由组合，迎合外层框架需求。
```
```
未完成
1.这一版先不加路由，纯html分开跳转
4.react的用法优化
5.react的mpa目录结构
完全配置参考modules-a
尝试 参照load用继承封装？
spin貌似得通过继承来做

ant的spin
message

最后封装

2.common部分的打包处理
3.查下splitChunks怎么用合适
```
#### completeDemo 我的完整项目demo
- build webpack构建文件（主要包含dll, copyWebpackPlugin, eslint, babel, less, HtmlWebpackPlugin, webpack-dev-server, hmr, CleanWebpackPlugin, webpack-merge, MiniCssExtractPlugin这些配置）
- src 生产文件
  - images 图片文件夹
  - locales 国际化目录
  - entry.js 入口函数
  - index.less 样式文件
- static 静态资源
- .eslintrc.js eslint配置文件
- .babelrc babel配置文件
- fav.ico ico
- index.ejs webpack HtmlWebpackPlugin模板
- postcss.config.js postcss配置文件