// 加载模块
const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)  // 用来读取配置文件（config）的模块
const router = require('./routes') // 加载./routes的目录，自动获取打index.js 内的exports
const pkg = require('./package')

const app = express()

// 设置模板目录
app.set('views',path.join(__dirname, 'views'))

// 设置模板引擎
app.set('view engine','ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname,'public')))
// 设置session 中间件 
app.use(session({
    name: config.session.key, // 设置cookie 中保存sessionid 的字段名称
    secret: config.session.secret, // 通过设置secret 来计算hash 值并放在cookie 中，产生signedCookies 防篡改
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge // 过期时间，过期后cookie 中的sessionid自动删除
    },

    store: new MongoStore({
        url: config.mongodb// mongodb 地址
    })
}))

// 设置flash 中间件，用来显示通知
app.use(flash())

// 处理表单以及文件上传的中间件
app.use(require('express-formidable')({
        uploadDir: path.join(__dirname,'public/img'),
        keepExtensions:true 
}))

// 设置模板全局变量
app.locals.blog = {
    title: 'ldzspace`s blog',
    description: '我就是我,不一样的烟火'
}

// 设置模板必需的三个变量
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
})


// 注入路由
router(app)

app.use(function (err, req, res, next) {
    console.error(err)
    req.flash('error', err.message)
    res.redirect('/posts')
})


// 监听端口，启动程序
app.listen(config.port, function(){
    console.log(`${pkg.name} listening on port ${config.port}`)
})