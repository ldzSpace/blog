const express = require('express');
const router = express.Router();
const User = require('../lib/mongo').User;
//const user = new User();

router.get('/',function(req, res, next){
    res.render('home');
});



module.exports = router;