/**
 * webpack 入口文件
 * 默认情况下，webpack能够处理js和json文件
 */
// import './style.css'
// import './index.css'
import index from "./index.json"
import './index.scss'
import './static/font/iconfont.css'
import './static/css/a.css'
import './static/css/b.css'


function add (a, b) {
    return a + b;
}

console.log("hello")
console.log(index.name)

