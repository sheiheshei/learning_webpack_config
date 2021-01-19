### webapck笔记

webpack默认可以读取js文件和json文件

#### 1、webpack配置示例

~~~js
/**
 * webpack.config.js是webpack配置文件，只是webpack怎么干活，运行时会加载其中配置
 * 基于mode.js平台运行，模块化使  用common.js
 */

//  暴露对象，在对象中写webpack配置
const { resolve } = require('path')
module.exports = {
    // 入口起点
    entry:"./src/index.js",
    //文件输出目录，其中__dirname是nodejs变量，表示当前文件的所在目录，现在指的是webpack.config.js文件目录
    output: {
        filename: "built.js",
        path:resolve(__dirname, "build"),

    },
    //loader配置,仅加载文件，
    module: {
        rules: [
            // 详细的loader配置
            {
                //匹配那 些文件
                test: /\.css$/i,
                //使用那些loader
                use: [
                    // 将js中的样式，创建style标签，将css样式放进去，最后添加到head中生效
                    'style-loader',
                    //将css文件变成commonjs模块加载到js中，内容是样式
                    'css-loader'
                ]
            }
        ]
    },
    // 插件配置，do somthing
    plugins:[

    ],

    //模式
    mode: "development"
}
~~~

#### 2、处理sass文件

rules:中的配置

~~~js
{
    test: /\.s[ac]ss$/i,
    use: [
        'style-loader',
        'css-loader',
        'sass-loader'
    ]
}
~~~

注意scss文件使用的是sass处理器

npm安装

~~~js
npm i sass-loader sass -D
~~~

#### 3、打包html资源

~~~js
//引入插件，其实是一个类
const HtmlWebpackPlugin = require("html-webpack-plugin")

//在module.export中配置
plugins:[
    //默认创建html文件，并引入打包之后的资源最后输出
    //需求：需要有结构的html文件，创建类的时候传入对象。设置template
    new HtmlWebpackPlugin({
        template:'./src/index.html',
    }),
],
~~~

> 注意：html-webpack-plugin不能和最新的webpack使用，否则报错，有待弄清楚什么原因

~~~javascript
npm i html-webpack-plugin
~~~

#### 4、打包图片资源

<h3 style="color:red">避坑指南：</h3>
~~~js
Error: options/query provided without loader (use loader + options) in {
~~~

> 使用options配置的时候只能使用一个loader，并且将use数组改成loader，后跟一个对象

**需要处理两种文件中的图片资源，css文件和html文件**

~~~javascript
{
    // 处理样式中background-img等属性引入的图片资源
    test:/\.jpg$/i,
    loader: 'url-loader',
    options: {
        limit: 8 * 1024,
        // url-loader使用的是es6模块进行解析，但是html-loader使用commonjs方式引入图片，解析时候出现		   //[object module]
        // s所以关闭esModule
        esModule: false,
        // 输出文件名称，hash:10,取hash值的前10位
		name:'[hash:5].[ext]'
        
    }
},
{
    // 处理html文件中通过img等标签引入的图片
    test: /\.html$/,
    // 处理html文件中的img图片，（负责引入img，能被后面的url-loader处理）
    loader: 'html-loader',
}
~~~

npm 安装

~~~javascript
npm i url-loader file-loader -D
~~~

> typora中使用Alt+Shift才能竖向编辑

#### 5、其他资源

其他资源：不需要打包压缩并且直接输出的文件

~~~javascript
{
    // 打包字体图标等其他资源
    exclude: /\.(css|js|html|jpg|json|scss)$/,
    loader: 'file-loader',
    options: {
        name: '[hash:5].[ext]'
    }
}
~~~

**<span style="color:red">排除的内容一定是前面配置处理过的文件，引入的文件是在index.js文件中引入的</span>**

npm安装file-loader

~~~js
npm i file-loader -D
~~~

__今天的整体配置__

___

~~~js
/**
 * webpack.config.js是webpack配置文件，只是webpack怎么干活，运行时会加载其中配置
 * 基于mode.js平台运行，模块化使用common.js
 */

//  暴露对象，在对象中写webpack配置
const { resolve } = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
    // 入口起点
    entry: "./src/index.js",
    //文件输出目录，其中__dirname是nodejs变量，表示当前文件的所在目录，现在指的是webpack.config.js文件目录
    output: {
        filename: "built.js",
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
                    'style-loader',
                    //将css文件变成commonjs模块加载到js中，内容是样式
                    'css-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                // 处理样式中background-img等属性引入的图片资源
                test:/\.jpg$/i,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    // url-loader使用的是es6模块进行解析，但是html-loader使用commonjs方式引入图片，解析时候出现[object module]
                    // s所以关闭esModule
                    esModule: false,
                    // 输出文件名称，hash:10,取hash值的前10位
                    name:'[hash:5].[ext]'
                }
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
                    name: '[hash:5].[ext]'
                }
            }
        ]
    },
    // 插件配置，do somthing
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
    ],

    //模式
    mode: "development"
}
~~~

<hr>

#### 6、webpack-dec-server

##### <span style="color:red">Error: Cannot find module 'webpack-cli/bin/config-yargs'</span>

>注意webpack-cli版本是否和webpack-dev-server版本相互兼容

~~~js
devServer: {
    contentBase: resolve(__dirname,"build"),
    //启动gzip压缩
    compress: true,
    port: 3000,
    //默认启动打开浏览器
    open: true,
}
~~~

#### 7、提取css成为单独的文件（生产环境）

npm安装插件

~~~js
npm i mini-css-extract-plugin -D
~~~

webpack.config.js配置

~~~js
new MiniCssExtractPlugin({
    filename: '/css/built.css'
}),
~~~

注意，css-loader将css文件中的样式加载到js中，style-loader提取js中的样式，最后创建style标签将样式放进去，为了能提取样式成单独的文件，所以需要将style-loader注释，采用mini-css-extract-plugin中自带的loader，其将js中的样式提取成一个文件，最后使用link标签引入

~~~javascript
{
    //匹配那些文件
    test: /\.css$/i,
    //使用那些loader
    use: [
        // 将js中的样式，创建style标签，将css样式放进去，最后添加到head中生效
        // 'style-loader',
        MiniCssExtractPlugin.loader,//提取js中的css成为单独文件
        //将css文件变成commonjs模块加载到js中，内容是样式
        'css-loader'
    ]
},
~~~

####  8、css兼容性处理

**<span style="color:red">避坑：</span>** 使用postcss的时候注意，plugins后面的箭头函数是一个数组，是**[ ]**不是**{ }**。

~~~js
{
    //匹配那些文件
    test: /\.css$/i,
    //使用那些loader
    use: [
        // 将js中的样式，创建style标签，将css样式放进去，最后添加到head中生效
        // 'style-loader',
        //提取js中的css成为单独文件
        MiniCssExtractPlugin.loader,
        //将css文件变成commonjs模块加载到js中，内容是样式
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
~~~

还可以在webpack.config.js文件中使用默认配置，然后将配置抽取成postcss.config.js文件（必须和webpack.config.js同一目录）

内容如下

~~~js
module.exports = {
  ident: 'postcss',
	plugins: [
		//使用postcss插件
		require('postcss-preset-env')
	]
}
~~~

#### 9、压缩css

npm安装插件

~~~js
npm i optimize-css-assets-webpack-plugin -D
~~~

引入，new插件，直接使用

~~~js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
plugins: [
    // 设置单独的html文件
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
    // 提取样式文件
    new MiniCssExtractPlugin({
        filename: '/css/built.css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
],
~~~



#### 10、配置压缩js和HTML

**压缩js：**

将webpack的模式调整成production

**压缩HTML：**

~~~js
new HtmlWebpackPlugin({
    template: './src/index.html',
    // 配置压缩html
    minify: {
        collapseWhitespace: true,
        removeComments: true
    }
}),
~~~

##### <span style="color:red">巨坑1：</span>

配置抽取css样式的时候，手贱在filename前面添加了 **"/"** ,导致最终HTML中引入的样式资源为下面样子

~~~js
new MiniCssExtractPlugin({
    filename: '/css/[name].css'
}),
~~~

编译后的html文件中为如下所示

~~~html
<link href="/css/main.css" rel="stylesheet"></head>
~~~

**/**  开头表示句对路径，相对于服务器的根路径，所以浏览器报下面错误（应该为相对路径）

最后控制台报错

<span style="color:red">Refused to apply style from 'http://127.0.0.1:5500/css/main.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.</span>

##### 解决方式：

```js
new MiniCssExtractPlugin({
    filename: 'css/[name].css'
}),
```





##### <span style="color:red">巨坑2：</span>

使用MiniCssExtractPlugin.loader时候，如果像上面一样在filename上添加了前缀，需要在loader的options中添加公共前缀，如下：

~~~js
{
    loader: MiniCssExtractPlugin.loader,
    // 设置样式中引入资源的公共路径
    options: {
        publicPath: '../'
    }
},
~~~

