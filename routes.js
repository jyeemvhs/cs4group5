var express = require('express')
var passport = require('passport')
var path = require('path')

var User = require('./models/User')
var Player = require('./models/Player')
var router = express.Router()
var playerID = 0

router.use(function (req, res, next) {
  res.locals.currentUserjy = req.user
  res.locals.errors = req.flash('error')
  res.locals.infos = req.flash('info')
  next()
})

router.get('/getID', function (req, res) {
  playerID++
  res.json({ newID: playerID })
})

router.get('/successroot', function (req, res) {
  res.json({ redirect: '/' })
})

router.get('/failroot', function (req, res) {
  res.json({ redirect: '/login.html' })
})

router.get('/successsignup', function (req, res) {
  res.json({ redirect: '/game' })
})

router.get('/failsignup', function (req, res) {
  res.json({ error: true, redirect: '/login.html' })
})

router.get('/successlogin', function (req, res) {
  res.json({ redirect: '/game' })
})

router.get('/faillogin', function (req, res) {
  res.json({ error: true, redirect: '/login.html' })
})

router.get('/', function (req, res, next) {
  res.sendFile(path.resolve(__dirname, 'public/login.html'))
})

router.get('/login', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'public/login.html'))
})

router.get('/game', function (req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.resolve(__dirname, 'public/views/index.html'))
  } else {
    res.sendFile(path.resolve(__dirname, 'public/login.html'))
  }
})

router.get('/playerInfo', function (req, res) {
  if (req.isAuthenticated()) {
    Player.find({}, function (error, info) {
      if (error) {
        return res.json(null)
      } else {
        res.json({
          username: req.user.username,
          x: 2345,
          y: 200,
          cx: 1495,
          cy: 395,
          speed: 15,
          coins: 0,
          inventory: [''],
          holding: 'Axe',
          facing: 'Left',
          isSwinging: false,
          face: 1,
          upgrades: ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
          color: '#0000ff',
        })
      }
    })
  } else {
    res.json(null)
  }
})

router.get('/logout', function (req, res) {
  if (req.isAuthenticated()) {
    req.logout()
    res.redirect('/successroot')
  } else {
    res.redirect('/failroot')
  }
})

router.post(
  '/signup',
  function (req, res, next) {
    var username = req.body.username
    var password = req.body.password

    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return next(err)
      }
      if (user) {
        req.flash('error', 'User already exists')
        return res.redirect('/failsignup')
      }

      var newUser = new User({
        username: username,
        password: password,
      })
      newUser.save(next) //goes to user.js (userSchema.pre(save))
    })
  },
  passport.authenticate('login', {
    //goes to setuppassport.js  (passport.use("login"))
    successRedirect: '/successsignup',
    failureRedirect: '/failsignup',
    failureFlash: true,
  })
)

router.post(
  '/login',
  passport.authenticate('login', {
    successRedirect: '/successlogin',
    failureRedirect: '/faillogin',
    failureFlash: true,
  })
)

router.get('/mainShop', function (req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.resolve(__dirname, 'public/views/shop/mainShop.html'))
  } else {
    res.sendFile(path.resolve(__dirname, 'public/login.html'))
  }
})
router.get('/Cave', function (req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.resolve(__dirname, 'public/views/cave.html'))
  } else {
    res.sendFile(path.resolve(__dirname, 'public/login.html'))
  }
})
router.get('/fishShop', function (req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.resolve(__dirname, 'public/views/shop/fishingShop.html'))
  } else {
    res.sendFile(path.resolve(__dirname, 'public/login.html'))
  }
})
router.get('/axeShop', function (req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.resolve(__dirname, 'public/views/shop/axeShop.html'))
  } else {
    res.sendFile(path.resolve(__dirname, 'public/login.html'))
  }
})
router.get('/pickaxeShop', function (req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.resolve(__dirname, 'public/views/shop/pickaxeShop.html'))
  } else {
    res.sendFile(path.resolve(__dirname, 'public/login.html'))
  }
})
router.get('/custom', function (req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.resolve(__dirname, 'public/views/custom/custom.html'))
  } else {
    res.sendFile(path.resolve(__dirname, 'public/login.html'))
  }
})
router.get('/music/map.wav', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'public/music/map.wav'))
})

module.exports = router
