const path = require("path")
const EslintWebpackPlugin = require("eslint-webpack-plugin")//使用 eslint 来查找和修复 JavaScript 代码中的问题
const HtmlWebpackPlugin = require("html-webpack-plugin")//处理html模板资源
const MiniCss = require("mini-css-extract-plugin")//提取css成单独文件
const MinimizerCss = require("css-minimizer-webpack-plugin") //css压缩
const TereserWebpackPlugin = require("terser-webpack-plugin") //js压缩
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")//图片压缩
const CopyPlugin = require('copy-webpack-plugin')//在webpack中拷贝文件和文件夹
const { VueLoaderPlugin } = require("vue-loader")
const { DefinePlugin } = require("webpack")//定义环境变量供源代码使用
// css loader
const getStyleLoader = (pre) => {
    return [
        {
            loader: MiniCss.loader,
            options: {
                publicPath: "../../",//css文件公共路径
            }
        }
        ,
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
        publicPath: '../dist/',//静态资源最终路径=output.publicPath+资源loader或插件等配置路径
        path: path.resolve(__dirname, "../dist"),
        filename: 'static/js/[name].[contenthash:10].js',//入口文件打包输出名
        chunkFilename: 'static/js/[name].[contenthash:10].chunk.js',//懒加载以及动态导入的js
        assetModuleFilename: 'static/media/[hash:10][ext][query]',
        clean: true,
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
                test: /\.(jpe?g|bmp|png|gif|webp|svg)$/,
                type: "asset/resource",
                parser: {//优化图片资源
                    dataUrlCondition: {
                        maxSize: 10 * 1024//小于10kb的图片被base64处理
                    }
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
        new MiniCss({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10].chunk.css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    //public下的资源复制到dist
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    globOptions: {
                        ignore: ['**/index.html'],//忽略index.html文件
                    }
                }
            ]
        }),
        new VueLoaderPlugin(),
        new DefinePlugin({//定义环境变量给源代码使用
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        })
    ],
    optimization: {
        // 压缩操作
        minimizer: [
            new MinimizerCss(),
            new TereserWebpackPlugin(),
            // 压缩图片
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),

        ],
        //代码分割,主要分割node_modules中的代码以及impor动态导入的语法
        splitChunks: {
            chunks: "all"
        },
        runtimeChunk: {//代码分割可能导致Chunk命名失效
            name: (entrypoint) => `runtime~${entrypoint.name}.js`,
        },
    },
    // webpack解析模板加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".vue", ".js", ".json"],
    },
    mode: "production",//生成模式html自动压缩 
    devtool: "source-map"
}