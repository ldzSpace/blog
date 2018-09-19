// 分配路由
module.exports = function(app) {
    app.get('/', function (req, res){ 
        res.redirect('/home');
    });

    app.use('/home', require('./home'));
    app.use('/signin',require('./signin')); 
    app.use('/signup', require('./signup'));
    app.use('/signout', require('./signout'));
    app.use('/posts', require('./posts'));
    app.use('/comments', require('./comments'));
    app.use('/about', require('./about'));
    app.use(function(req, res){
        if(!res.headersSend){
             res.status(404).render('404');
        }
    });
};

