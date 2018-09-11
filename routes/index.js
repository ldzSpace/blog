// 分配路由
module.exports = function(app) {
    app.get('/', function (req, res){ 
        res.redirect('/signin');
    });
    app.use('/signin',require('./signin')); // 写错了吧
    app.use('/signup', require('./signup'));
    app.use('/signout', require('./signout'));
    app.use('/posts', require('./posts'));
    app.use('/comments', require('./comments'));

    app.use(function(req, res){
        if(!res.headersSend){
             res.status(404).render('404');
        }
    })
}

