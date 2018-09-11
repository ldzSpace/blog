const express = require('express')
const router =  express.Router()
const checkLogin = require('../middlewares/check').checkLogin

router.post('/', checkLogin, function(req, res, next){
    res.sender('创建留言');
})

router.get('/:commentId/remove', checkLogin, function(req, res, next){
    res.sender('删除留言');
})

module.exports = router