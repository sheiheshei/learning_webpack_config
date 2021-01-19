/**
 * webpack.config.js是webpack配置文件，只是webpack怎么干活，运行时会加载其中配置
 * 基于mode.js平台运行，模块化使用common.js
 */

//  暴露对象，在对象中写webpack配置
const { resolve } = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')


// 设置node环境变量，因为 postcss-preset-env 默认从生产环境读取配置
process.env.NODE_ENV = 'development'

module.exports = {
    // 入口起点
    entry: "./src/index.js",
    //文件输出目录，其中__dirname是nodejs变量，表示当前文件的所在目录，现在指的是webpack.config.js文件目录
    output: {
        filename: "js/built.js",
        path: resolve(__dirname, "build"),
    },
    //loader配置,仅加载文件，
    module: {
        rules: [
            // 详细的loader配置
            {
                //匹配那些文件
                test: /\.css$/i,
                //使用那些loader
                use: [
                    // 将js中的样式，创建style标签，将css样式放进去，最后添加到head中生效
                    // 'style-loader',
                    //提取js中的css成为单独 文 件
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    //将css文件变成commonjs模块加载到js中，内容是css样式
                    'css-loader',
                    /**
                     * css兼容性处理：postcss --> postcss-loader postcss-preset-env
                     * postcss-preset-env:帮助postcss找到package.json中的browserslist中的配置，通过配置加载指定的css兼容性样式
                     * github上找browserlist,找使用说明
                     */
                    // 使用默认配置
                    // 'postcss-loader'
                    // 修改默认配置
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                // postcss插件
                                require('postcss-preset-env')()
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // 'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        // 设置样式中引入资源的公共路径
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                // 处理样式中background-img等属性引入的图片资源
                test: /\.jpg$/i,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    // url-loader使用的是es6模块进行解析，但是html-loader使用commonjs方式引入图片，解析时候出现[object module]
                    // s所以关闭esModule
                    esModule: false,
                    // 输出文件名称，hash:10,取hash值的前10位
                    name: '[hash:5].[ext]',
                    // 配置输出文件目录
                    outputPath: 'imgs'
                },
            },
            {
                // 处理html中通过img等标签引入的图片
                test: /\.html$/,
                // 处理html文件中的img图片，（负责引入img，能被后面的url-loader处理）
                loader: 'html-loader',
            },
            {
                // 打包字体图标等其他资源
                exclude: /\.(css|js|html|jpg|json|scss)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:5].[ext]',
                    outputPath: 'media'
                },
            }
        ]
    },
    // 插件配置，do somthing
    plugins: [
        // 设置单独的html文件
        new HtmlWebpackPlugin({
            template: './src/index.html',
            // 配置压缩html,不用配置，设置webpack为production模式的时候会压缩
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        // 提取样式文件
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin(),
    ],

    //模式
    mode: "development",

    // 开发服务器
    // 只会在内存里编译打包，不会输出代码
    // 启动指令npx webpack-dev-server,因为是本地安装的。
    devServer: {
        contentBase: resolve(__dirname, "build"),
        //启动gzip压缩
        compress: true,
        port: 3000,
        //默认启动打开浏览器
        open: true,
    }
}