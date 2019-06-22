const isDevMode = process.env.NODE_ENV !== 'production';
const path = require('path');
const webpack = require('webpack');
// console.log('---------');
// console.log(isDevMode);
// 静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const MODULES_PATH = path.resolve(__dirname, '../src/modules');
// fs文件系统。fs.readdirSync同步版的返回 指定目录下所有文件名称的数组对象
const moduleNameArray = fs.readdirSync(MODULES_PATH);
const moduleEntryObj = {};
const htmlPluginArray = [];

moduleNameArray.forEach((item) => {
    // moduleEntryObj
    moduleEntryObj[item] = `./src/modules/${item}/index.js`;
    // htmlWebpackPlugin
    let html = null;
    if(isDevMode){
        html = new HtmlWebpackPlugin({
            // 设置生成的index.html的title，设置template模板后会被覆盖
            title: item,
            // html生成子目录，默认为output.path也就是dist/下
            filename: `${item}.html`,
            template: 'index.ejs',
            favicon: 'fav.ico',
            chunks: [item],
            // 注入方式。true,'body'使js资源放入body底部。'head'使js资源放入body头部
            inject: true
        });
    }else{
        html = new HtmlWebpackPlugin({
            // 设置生成的index.html的title，设置template模板后会被覆盖
            title: item,
            // html生成子目录，默认为output.path也就是dist/下
            filename: `${item}.html`,
            template: 'index.ejs',
            favicon: 'fav.ico',
            chunks: [item],
            // 注入方式。true,'body'使js资源放入body底部。'head'使js资源放入body头部
            inject: true,
            // 使变小
            minify: {
                // 去除html注释
                removeComments: true,
                // 去除html空格
                collapseWhitespace: true,
                // 尽可能去除属性引号
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            }
        });
    }
    htmlPluginArray.push(html);
});

module.exports={
    // context目录，配置entry points and loaders。文档建议配置，使我的配置独立于CWD（当前目录）。
    context: path.resolve(__dirname, '../'),
    entry:{
        // entry默认'./src'，entry只能设置在context目录下的./，context目录默认为项目根目录。所以此处'./'指项目根目录下
        // common: [],
        ...moduleEntryObj
    },    
    module:{
        rules:[            
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
                // options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
                //     formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                // }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                    // 也可直接在此配置babel配置
                    // options: {
                    //     presets: ['@babel/preset-env'],
                    //     plugins: []
                    //     // 指定目录缓存Babel加载结果，提高速度
                    //     // cacheDirectory: true
                    // }
                }
            },                        
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    // limit以下使用url-loader转为base64，以上使用指定loader，默认file-loader处理图片图片。单位：字节
                    limit: 10000,
                    // [ext]文件扩展名
                    name:isDevMode ? "[name].[ext]" : "static/common/assets/[name].[hash:8].[ext]"                    
                }
            }                        
        ]
    },
    resolve: {
        // extensions: ['.js', '.html', '.css'],
        alias: {
            // 'vue$': 'vue/dist/vue.esm.js',
            '@':path.resolve(__dirname,'../src/common')
        }
    },
    plugins: [
        //复制静态文件
        new copyWebpackPlugin([
            {
                from: path.resolve(__dirname,"../static"),
                // output.path中的位置
                to: 'static',
                // 忽略.xxx等文件
                ignore: ['.*']
            },         
        ]),        
        // html模板
        ...htmlPluginArray,
        // DllReferencePlugin引用打包好的manifest清单来进行第二次打包
        // 开发环境中预打包好第三方库，提升再次开发构建速度
        // 但是生产环境不用dll，因为dll无法像optimization.splitChunks按需打包，如ant会整个预打包好，会增加不必要代码（个人理解）？
        // 貌似生产环境用了dll也快了许多，也许dll和splitChunk不冲突，dll也能分组件给splitChunk抽取打包
        new webpack.DllReferencePlugin({
            // 指导Webpack匹配manifest.json中库的路径，和DllPlugin中有关系
            context: path.resolve(__dirname, '../dll'),
            // manifest相对于此文件的位置
            manifest: path.resolve(__dirname, '../dll/manifest.json')
        })        
    ],
    optimization: {
        // 我的理解，在多页面且用了splitChunk时，使runtimeChunk打包为多个，开发时不用把公共依赖也重新编译
        // runtimeChunk: "multiple"        
    },     
    output:{
        // 由于dev模式，我把所有资源css,js,png统一放在根目录。prod模式，css在static中，所以要在公共资源前加公共路径'/'
        publicPath: isDevMode ? '' : '/',
        // 以文件夹起服务时，添加'/projectA/'项目名
        // publicPath: isDevMode ? '' : '/projectA/',
        // vue-cli里的[chunkhash]？
        filename: isDevMode ? '[name].js' : 'static/modules/[name]/[name].[hash:8].js',
        // filename:'js/[name].[chunkhash].js',
        path: path.resolve(__dirname, '../dist')
    },    
}
    
