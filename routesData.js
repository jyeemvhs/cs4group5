var express = require('express')

var UserDB = require('./models/User')
var router = express.Router()

const myDatabase = require('./myDatabase')
let db = new myDatabase()

const Player = require('./Player')

router.use(function (req, res, next) {
  res.locals.currentUserjy = req.user
  res.locals.errors = req.flash('error')
  res.locals.infos = req.flash('info')
  next()
})

router.post('/create', function (req, res) {
  let username = req.body.username.trim()
  if (username == '') {
    res.json({ error: true })
    return
  }

  let data = { username: username }
  return db.postData(data, res)
})

router.get('/read', function (req, res) {
  return db.getData(req.user.username, res)
})

router.get('/getName', function (req, res) {
  if(req.user == undefined || req.user == null) return
  let username = req.user.username
  res.json({ error: false, name: username })
})

router.put('/savePlayer', function (req, res) {
  let obj = {
    username: req.user.username,
    x: req.body.x,
    y: req.body.y,
    cx: req.body.cx,
    cy: req.body.cy,
    speed: req.body.speed,
    coins: req.body.coins,
    inventory: req.body.inventory,
    holding: req.body.holding,
    facing: req.body.facing,
    isSwinging: req.body.isSwinging,
    face: req.body.face,
    upgrades: req.body.upgrades,
    color: req.body.color,
  }
  //changed code.
  return db.putData(obj, res)
})

router.delete('/delete/:identifier', function (req, res) {
  let name = req.user.username.trim()
  if (name == '') {
    res.json({ error: true })
    return
  }
  //changed code.
  return db.deleteData(name, res)
})

module.exports = router
