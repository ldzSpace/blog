//  config-lite 是一个轻量的读取配置文件的模块, 已经安装了，会根据NODE_ENV来加载不同的config
// 但是这里我们没有使用NODE_ENV，他会默认加载default.js

module.exports = {
    port: 4000,
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge:2592000000
    },
    mongodb: 'mongodb://127.0.0.1:27017/myblog' // 不要使用localhost 使用127.0.0.1
}
