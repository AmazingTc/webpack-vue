const path = require("path")
const EslintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { VueLoaderPlugin } = require('vue-loader')
const {DefinePlugin}=require('webpack')//定义环境变量，给代码使用
// css loader
const getStyleLoader = (pre) => {
    return [
        "vue-style-loader",
        "css-loader",
        {
            //兼容性处理
            //配合package.json中的browserslist来指定兼容程度
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: ["postcss-preset-env"],
                }
            }
        },
        pre
    ].filter(Boolean)//过滤掉undefined(没有传递pre)

}
module.exports = {
    entry: './src/main.js',
    output: {
        path: undefined,
        filename: 'static/js/[name].js',//入口文件打包输出名
        chunkFilename: 'static/js/[name].chunk.js',//懒加载以及动态导入的js
        assetModuleFilename: 'static/media/[hash:10][ext][query]',
    },
    module: {
        rules: [
            // 处理css
            {
                test: /\.css$/,
                use: getStyleLoader()
            },
            // 处理less
            {
                test: /\.less$/,
                use: getStyleLoader("less-loader")
            },
            // 处理sass
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoader("sass-loader")
            },
            // 处理stylus
            {
                test: /\.styl$/,
                use: getStyleLoader("stylus-loader")
            },
            //处理图片
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                type: "asset",
                parser: {
                  dataUrlCondition: {
                    maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
                  },
                },
            },
            // 处理字体图标
            {
                test: /\.(ttf|woff2?|mp4|mp3|avi)$/,
                type: "asset/resource",
                generator: {
                    filename: "static/media/[hash:10][ext][query]"
                }
            },
              // 处理vue
              {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // 开启缓存
                    cacheDirectory: path.resolve(
                      __dirname,
                      "node_modules/.cache/vue-loader"
                    ),
                  },
            },
            // 处理js
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,//缓存
                    cacheCompression: false,//不压缩
                }
            },
        ]
    },
    plugins: [
        new EslintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache//eslintCache"),//缓存目录
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),//模板
        }),
        new VueLoaderPlugin(),
        // cors-env定义的环境变量是给webpack使用，DefinePlugin定义环境变量给代码使用，解决vue3警告
        new DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:false
        })
    ],
    optimization: {//代码分割,主要分割node_modules中的代码以及impor动态导入的语法
        splitChunks: {
            chunks: "all"
        },
        runtimeChunk: {//代码分割可能导致Chunk命名失效
            name: entrypoint => `runtime~${entrypoint.name}.js`,
        }
    },
    // webpack解析模板加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".vue", ".js", ".json"],
        alias: {
            '@': path.join(__dirname,'/src')
          }
    },
    mode: "development",
    devtool: "cheap-module-source-map",
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true,//热模板替换
        compress:true,
        historyApiFallback: true,//解决前端路由刷新404问题
    },
}