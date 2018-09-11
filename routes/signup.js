const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup'); // 指向views 中的同名文件
})

// POST /signup 用户注册, 提交用户信息
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name;
  const gender = req.fields.gender;
  const bio = req.fields.bio
  const avatar = req.fields.avatar
  let password = req.fields.password
  const repassword = req.fields.repassword
  console.log('name+'+name)
  console.log('gender+'+gender)
  console.log('bio+'+bio)
  console.log('password+'+password)
  console.log('repassword+'+repassword)
  //console.log('avatar+'+avatar)
  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      console.log('名字请限制在 1-10 个字符')
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      console.log('性别只能是 m、f 或 x')
      throw new Error('性别只能是 m、f 或 x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      console.log('个人简介请限制在 1-30 个字符')
      throw new Error('个人简介请限制在 1-30 个字符')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      console.log('密码至少 6 个字符')
      throw new Error('密码至少 6 个字符')
    }
    if (password !== repassword) {
      console.log('两次输入密码不一致')
      throw new Error('两次输入密码不一致')
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    //fs.unlink(req.files.avatar.path)
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  // 明文密码加密
  password = sha1(password)

  // 待写入数据库的用户信息
  let user = {
    name: name, //name,
    password: password, //password,
    gender: gender,//gender,
    bio: bio, //bio,
    avatar: "avatar"// avatar
  }
  // 用户信息写入数据库
  UserModel.create(user)
    .then(function (result) {
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0]
      // 删除密码这种敏感信息，将用户信息存入 session
      delete user.password
      req.session.user = user
      // 写入 flash
      req.flash('success', '注册成功')
      // 跳转到首页
      res.redirect('/posts')
    })
    .catch(function (e) {
      // 注册失败，异步删除上传的头像
     // fs.unlink(req.files.avatar.path)
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名已被占用')
        return res.redirect('/signup')
      }
      next(e)
    })
})

module.exports = router