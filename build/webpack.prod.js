process.env.NODE_ENV = 'production';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserJSPlugin = require("terser-webpack-plugin");
// 压缩css，另外需要安装UglifyJsPlugin
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode:'production',
  devtool:'source-map',
  module:{
    rules:[
      {
        test: /\.(css|less|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
            // options: {                            
                // 可以给css文件中单独设置公共路径
                // publicPath: '../',
                // 开发模式开启hmr（只支持css文件的热加载），此option与style-loader冲突
                // hmr: isDevMode,
                // code-splitting时hmr可能失效，开启reloadAll强制重新渲染
                // reloadAll: true
            // }
          },
          // 对应less,sass的loader
          "css-loader",
          {
            loader: "postcss-loader"
          },
          {
            loader: "less-loader",
            options: {
              // 为了兼容babel-plugin-import ant
              javascriptEnabled: true
              // ant主题
              // modifyVars: {
              //     'primary-color': '#1DA57A',
              //     'link-color': '#1DA57A',
              //     'border-radius-base': '2px',
              // }
            }
          }
        ]            
      }
    ]
  },
  plugins:[    
    new CleanWebpackPlugin(
      // 自动清除output.path下目录
      {
        verbose:true
      }
    ),
    new MiniCssExtractPlugin({
      // 同步打包方法，如通过Entrypoint，import styles from './file.css' (in entry.js) => entry.css
      // vendors文件夹和optimization.splitChunks有关。vendors文件夹中的css为空，是因为optimization.splitChunks未启动，等达到启用标准抽出来后（如5个引入，且达到30k）vendors文件夹中的css就有了
      filename: 'static/modules/[name]/[name].[hash:8].css'
      // filename: isDevMode ? '[name].css' : 'static/modules/[name]/[name].[hash:8].css'

      // 异步打包方法，如通过import(/* webpackChunkName: "foo" */ './file.css') => foo.css
      // 暂未发现类似[name]的[chunkname]去替代[name]
      // chunkFilename: isDevMode ? "[name].css" : "static/modules/[name]/[name].[hash:8].css"
    })      
  ],  
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        // 开启缓存
        cache: true,
        // 多进程加快压缩
        parallel: true,
        // 打开source maps，显著减慢编译速度，和devtool不重复用
        // sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    // optimization.splitChunks代码引用去重分离，把公共引用代码抽离到再另一个output.js中
    // optimization.splitChunks是用在多页面代码去重分离的
    // 单页面所有第三方库已经用了dll配合manifest保证只引入一次了，不用optimization.splitChunks了
    // 如果多页面用了dll还需要用optimization.splitChunks的，如果生成的commonSplit.js文件过大，可以试试import(/* webpackChunkName:"xxx"*/ 'xxx')动态引入xxx库，打包时output会通过chunkFilename动态拆分细化commonSplit.js，减小不必要的加载
    // splitChunks应该没有dll构建快，但是能做到只打包按需引入部分，使生产包里大小最小，所以在生产环境用splitChunks而不用dll
    // 生产构建时，加splitChunks配置和不加，差别还是非常巨大的
    splitChunks:{
        // 使用默认配置
        chunks:'all',
        // 至少有2个entry文件引用重复时分离
        minChunks: 2,
        // 和不设类似，就是名字替换成1，2
        name: false
        // 细分了依赖后打包速度略微加快，生产包大小成倍增大，不行
        // cacheGroups: {
        //   vendors: {
        //     // 分离node_modules中的生产依赖
        //     test: (module) => {
        //       return /react|react-dom|antd|echarts-for-react|prop-types|jquery|moment|postal/.test(module.context);
        //     },
        //     priority: 10
        //   },          
        // }
    },
    // 多页面开启single避免每个chunk都写入了webpack初始化，设置single多页面将只写入一个webpack初始化
    runtimeChunk: "single"    
  }
});