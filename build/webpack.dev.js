process.env.NODE_ENV = 'development';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode:'development',
  devtool: 'eval-source-map',// cheap-eval-source-map cheap-module-eval-source-map
  devServer: {
    // 默认为项目根目录，无特殊需求不需设contentBase
    contentBase: false,
    // host: 'localhost',
    // port: '8080',
    open: true, // 启动后打开浏览器
    hot: true, // 热加载
    // proxy: {
    //   '/xxx': {
    //     target: 'https://xxx.com/',
    //     // 取消https上的安全要求
    //     // secure: false,
    //     // 虚拟域名站点需要
    //     // changeOrigin: true
    //   }
    // }
  },
  module:{
    rules:[
      {
          test:/\.less$/,
          use: [
              {
                  loader: 'style-loader' // 样式热替换，creates style nodes from JS strings
              },
              {
                  loader: 'css-loader' // translates CSS into CommonJS
              },
              {
                  loader: 'less-loader', // compiles Less to CSS
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
    // 热替换
    new webpack.HotModuleReplacementPlugin()        
  ]
});