const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()
const http = require('http')
const path = require('path')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
let router = express.Router()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
let publicPath = path.resolve(__dirname, 'public')
app.use('/', express.static(publicPath))
app.use('/mainShop', express.static(publicPath + './views/shop/mainShop.html'))
app.use('/Cave', express.static(publicPath + './views/cave.html'))
app.use('/fishShop', express.static(publicPath + './views/shop/fishingShop.html'))
app.use('/axeShop', express.static(publicPath + './views/shop/axeShop.html'))
app.use('/pickaxeShop', express.static(publicPath + './views/shop/pickaxeShop.html'))
app.use('/custom', express.static(publicPath + './views/custom/custom.html'))
let UserList = []
let ShopList = []
let CustomList = []
let PlayersList = []
let TreeList = []
let RockList = []
let CaveList = []
let FishintimeList = []
let playerCount = 0
const Lakefish = new Map()
Lakefish.set(1, {name: 'Gold', value: 1, image:'/imgs/items/fish0'})
Lakefish.set(2, {name: 'Nose', value: 5, image:'/imgs/items/fish1'})
Lakefish.set(3, {name: 'Cap', value: 10,image:'/imgs/items/fish2'})
Lakefish.set(4, {name: 'MarylinMon', value: 15,image:'/imgs/items/fish3'})
Lakefish.set(5, {name: 'Nerd', value: 20, image:'/imgs/items/fish4'})
Lakefish.set(6, {name: 'Detos', value: 25, image:'/imgs/items/fish5'})
Lakefish.set(7, {name: 'Sharl', value: 100, image:'/imgs/items/fish6'})
const lockMap = new Map()
server.listen(3005, () => {
  console.log('listening on *:3005')
})

////New Database
var cookieParser = require('cookie-parser')
var flash = require('connect-flash')
var mongoose = require('mongoose')
var passport = require('passport')
var session = require('express-session')

var setUpPassport = require('./setuppassport')
var routes = require('./routes')
var routesData = require('./routesData.js')

//27017 seems to be the port number used by mongod
mongoose.connect('mongodb://127.0.0.1:27017/group523')
setUpPassport()

app.use('/js', express.static('./public/js'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  session({
    secret: 'LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t',
    resave: true,
    saveUninitialized: true,
  })
)

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)
app.use(routesData)

io.on('connection', (sock) => {
  sock.on('goodGet', (data) => {
    PlayersList[sock.id] = {
      PlayerName: data.username,
      x: data.x,
      y: data.y,
      speed: data.speed,
      coins: data.coins,
      inventory: data.inventory,
      holding: data.holding,
      facing: data.facing,
      color: data.color,
      cx: data.cx,
      cy: data.cy,
      face: data.face,
      upgrades: data.upgrades,
      id: sock.id,
    }
    UserList.push(PlayersList[sock.id])
  })
  sock.on('badGet', () => {
    PlayersList[sock.id] = {
      PlayerName: 'Hello',
      x: 2345,
      y: 200,
      speed: 15,
      coins: 0,
      inventory: [''],
      holding: 'Axe',
      facing: 'left',
      color: 'blue',
      cx: 1495,
      cy: 395,
      face: 2,
      upgrades: ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
      id: sock.id,
    }
    UserList.push(PlayersList[sock.id])
  })
  sock.on('sell', (player) => {
    console.log('selling')
    let sold = 0
    console.log(player.inventory.length)
    if (player != undefined && player.inventory.length > 1) {
      for (let item of player.inventory) {
        if (item != '') {
          sold += Number(item.value)
        }
      }
      player.coins += sold
      player.inventory = []
    }

    io.to(sock.id).emit('selling', sold, player)
  })
  sock.on('upgrade', (data) => {
    console.log('before| level: ' + data.player.upgrades[data.index] + ' coins: ' + data.player.coins)
    let level = Number(data.player.upgrades[data.index]) + 1
    data.player.upgrades[data.index] = Number(level)
    data.player.coins -= data.cost
    io.to(sock.id).emit('upgraded', data.player)
  })
  playerCount++
  io.emit('newPlayer')

  sock.on('update', () => {
    io.emit('update-players', {
      UserList,
      currentUser: PlayersList[sock.id],
      TreeList,
      RockList,
    })
  })

  sock.on('setName', (name) => {
    PlayersList[sock.id].PlayerName = name
    for (user of UserList) {
      if (user.id == sock.id) {
        user.PlayerName = name
      }
    }
  })

  sock.on('customArrive', () => {
    io.to(sock.id).emit('customWait', { CL: CustomList })
  })
  sock.on('update-color', (data) => {
    for (player of CustomList) {
      if (player.PlayerName == data.name) {
        player.color = data.color
      }
    }
    io.to(sock.id).emit('customWait', { CL: CustomList })
  })
  sock.on('update-face', (data) => {
    for (player of CustomList) {
      if (player.PlayerName == data.name) {
        player.face = data.face
      }
    }
    io.to(sock.id).emit('customWait', { CL: CustomList })
  })

  sock.on('keyPress', (keypresses) => {
    let currentUser = PlayersList[sock.id]
    for (let keypress of keypresses) {
      if (currentUser != undefined && !(lockMap.has(sock.id))) {
        if (keypress == '1') {
          currentUser.holding = 'Axe'
        }
        if (keypress == '2') {
          currentUser.holding = 'Pickaxe'
        }
        if (keypress == '3') {
          currentUser.holding = 'Rod'
        }
        if (currentUser.x >= 1585 && currentUser.x <= 1675 && currentUser.y > 1400 && currentUser.y < 1490) {
          io.to(sock.id).emit('promptingShop')
        }
        if (currentUser.x >= 40 && currentUser.x <= 130 && currentUser.y >= 90 && currentUser.y <= 240) {
          io.to(sock.id).emit('promptingCave')
        }
        if (currentUser.x >= 1835 && currentUser.x <= 1925 && currentUser.y > 1400 && currentUser.y < 1490) {
          io.to(sock.id).emit('promptingCustom')
        }
          if (keypress == 'up') {
             if(currentUser.x >= -5 && currentUser.x <= 1645) {
                if(currentUser.x >= 1330 && currentUser.x <= 1645) {
                    if(currentUser.y - currentUser.speed >= 110 && currentUser.y - currentUser.speed > -5 && currentUser.y <= 260) {
                        currentUser.y = currentUser.y - currentUser.speed
                    } else {
                        if(currentUser.y - currentUser.speed > 725 && currentUser.y - currentUser.speed > -5) {
                            currentUser.y = currentUser.y - currentUser.speed
                        }
                    }
                } else
                if(currentUser.y - currentUser.speed <= 410 && currentUser.y - currentUser.speed > -5) {
                    currentUser.y = currentUser.y - currentUser.speed
                }
                else if(currentUser.y - currentUser.speed > -5  && currentUser.y - currentUser.speed > 725) {
                    currentUser.y = currentUser.y - currentUser.speed
                }  
            } else {
                if(currentUser.y - currentUser.speed > -5)
                    currentUser.y = currentUser.y - currentUser.speed
            }
          } else if (keypress == 'down') {
                if(currentUser.y + currentUser.speed <= 1460) {
                    if(currentUser.x >= -5 && currentUser.x <1330) {
                        if(currentUser.y + currentUser.speed <=410) {
                            currentUser.y = currentUser.y + currentUser.speed
                        } else {
                            if(currentUser.y >= 725) {
                                currentUser.y = currentUser.y + currentUser.speed
                            }
                        }
                    } else
                    if(currentUser.x >= 1330 && currentUser.x <=1645) {
                        if(currentUser.y + currentUser.speed <=260) {
                            currentUser.y = currentUser.y + currentUser.speed
                        } else {
                            if(currentUser.y > 725) {
                                currentUser.y = currentUser.y + currentUser.speed
                            }
                        }
                    } else
                    if(currentUser.x >= 2755 && currentUser.x <=2905) {
                        if(currentUser.y + currentUser.speed <=1235) {
                            currentUser.y = currentUser.y + currentUser.speed
                        }
                    } else
                    {
                        currentUser.y = currentUser.y + currentUser.speed
                    }

                }
          } else if (keypress == 'left') {
            if(currentUser.y >= -25 && currentUser.y <= 1460) {
                if(currentUser.x > 1645 && currentUser.x <= 2905) {
                    if(currentUser.y <= 725 && currentUser.y >= 260) {
                        if(currentUser.x - currentUser.speed > 1645) {
                            currentUser.x = currentUser.x - currentUser.speed
                            currentUser.facing = 'left'
                        }
                    } else if(currentUser.y <= 110 && currentUser.y >= -25) {
                        if(currentUser.x - currentUser.speed > 1645) {
                            currentUser.x = currentUser.x - currentUser.speed
                            currentUser.facing = 'left'
                        }
                    } else {
                        currentUser.x = currentUser.x - currentUser.speed
                        currentUser.facing = 'left'
                    }
                } else {
                    if(currentUser.x - currentUser.speed >= -5) {
                        currentUser.x = currentUser.x - currentUser.speed
                        currentUser.facing = 'left'
                    }
                }
            }
          } else if (keypress == 'right') {
            if(currentUser.x + currentUser.speed <= 2905) {
                if(currentUser.y <= 410) {
                    if(currentUser.y <= 110) {
                        if(currentUser.x + currentUser.speed < 1345) {
                            currentUser.x = currentUser.x + currentUser.speed
                            currentUser.facing = 'right'
                        } else {
                          if(currentUser.x + currentUser.speed > 1600) {
                            currentUser.x = currentUser.x + currentUser.speed
                            currentUser.facing = 'right'
                          }
                        }
                    } else if(currentUser.y >= 260) {
                        if(currentUser.x + currentUser.speed < 1345) {
                            currentUser.x = currentUser.x + currentUser.speed
                            currentUser.facing = 'right'
                        } else {
                          if(currentUser.x + currentUser.speed > 1600) {
                            currentUser.x = currentUser.x + currentUser.speed
                            currentUser.facing = 'right'
                          }
                        }
                    } else {
                        currentUser.x = currentUser.x + currentUser.speed
                         currentUser.facing = 'right'
                    }
                } else if(currentUser.x <= 2755 && currentUser.y >= 1235){
                    if(currentUser.x + currentUser.speed <= 2755) {
                        currentUser.x = currentUser.x + currentUser.speed
                        currentUser.facing = 'right'
                    }
                } else {
                    currentUser.x = currentUser.x + currentUser.speed
                    currentUser.facing = 'right'
                }
            }
          }
          io.emit('update-players', { UserList, currentUser, TreeList, RockList })
          if (keypress == 'space') {
            currentUser.isSwinging = true
            io.to(sock.id).emit('swingTool', { currentUser, TreeList, RockList })
            if(currentUser.holding === 'Rod') {
              if(currentUser.x >= -5 && currentUser.x <=1665) {
                if(currentUser.y >= 400 && currentUser.y <= 450) {
                  fishingRiver(sock)
                }
                if(currentUser.y >= 725 && currentUser.y <= 750) {
                  fishingRiver(sock)
                }
                if(currentUser.x >= 1330 && currentUser.x <=1645 && currentUser.y >= 110 && currentUser.y <= 260) {
                  fishingRiver(sock)
                }
                if(currentUser.x >= 1645 && currentUser.x <=1665 && currentUser.y >= -25 && currentUser.y <= 730) {
                  fishingRiver(sock)
                }
                if(currentUser.x >= 1320 && currentUser.x <=1330 && currentUser.y >= -25 && currentUser.y <= 440){
                  fishingRiver(sock)
                }
                if(currentUser.y <= 400 && currentUser.x <= 1320 ) {
                  sock.emit('notcloseenoughtowatertofish')
                }
                if(currentUser.y >= 750) {
                  sock.emit('notcloseenoughtowatertofish')
                }
              } else if(currentUser.x >= 2745 && currentUser.x <=2905) {
                 {
                  if(currentUser.y >= 1230 && currentUser.y <= 1460) {
                    (Number(PlayersList[sock.id].upgrades[0]) >= 3) ? fishingLake(sock) : io.to(sock.id).emit('upgraderod', Number(PlayersList[sock.id].upgrades[0]))
                  }else {
                    sock.emit('notcloseenoughtowatertofish')
                  }
                }
              }else {
                sock.emit('notcloseenoughtowatertofish')
              }
            } 
          }
          if (keypress == 'i') {
            var inv = ''
            if (currentUser != undefined) {
              for (let i = 1; i != currentUser.inventory.length; i++) {
                let item = currentUser.inventory[i]
                if(item != undefined && item != null)
                  inv += "<img style='width:20%;' src='" + item.image + ".png'/><br>" + item.name + ' | value: ' + item.value + '<br>'
                console.log(item)
              }
              if (inv === '') inv = 'Your have no items to display'
              var inventory = 'You have ' + currentUser.coins + ' coins<br>'
              if (currentUser.coins == 1) inventory = 'You have ' + currentUser.coins + ' coins<br>'
              inventory += inv
              io.to(sock.id).emit('inv', inventory)
            }
          }
      }
    }
  })
  sock.on('lock', () => { lockMap.set(sock.id),true})
  sock.on('unlock', () => { lockMap.delete(sock.id)})
  sock.on('keyPressCave', (keypress) => {
    let currentUser = PlayersList[sock.id]
    if (currentUser != undefined) {
      currentUser.holding = 'Pickaxe'
    }
    if (currentUser.cx >= 1225 && currentUser.cx <= 1720 && currentUser.cy >= 0 && currentUser.cy <= 335) {
      io.to(sock.id).emit('Iwanttogohomedad', PlayersList[sock.id])
    }

    if (currentUser != undefined) {
      if (keypress == 'up') {
        if(currentUser.cy - currentUser.speed > 300)
        currentUser.cy = currentUser.cy - currentUser.speed
      } else if (keypress == 'down') {
        if(currentUser.cy + currentUser.speed < 1445)
        currentUser.cy = currentUser.cy + currentUser.speed
      } else if (keypress == 'left') {
        if(currentUser.cx + currentUser.speed > 220) {
          currentUser.cx = currentUser.cx - currentUser.speed
          currentUser.facing = 'left'
        }
      } else if (keypress == 'right') {
        if(currentUser.cx - currentUser.speed < 2710) {
          currentUser.cx = currentUser.cx + currentUser.speed
          currentUser.facing = 'right'
        }
      }
      io.emit('update-players', { UserList, currentUser, TreeList, RockList })
      if (keypress == 'space') {
        currentUser.isSwinging = true
        io.to(sock.id).emit('swingTool', { currentUser, TreeList, RockList })
      }
      if (keypress == 'i') {
        var inv = ''
        if (currentUser != undefined) {
          for (item of currentUser.inventory) {
            inv += "<img style='width:20%;' src='" + item.image + ".png'/><br>" + item.name + ' | value: ' + item.value + '<br>'
          }
          if (inv === '') inv = 'Your have no wood'
          var inventory = 'You have ' + currentUser.coins + ' coins<br>'
          if (currentUser.coins == 1) inventory = 'You have ' + currentUser.coins + ' coin<br>'
          inventory += inv
          io.to(sock.id).emit('inv', inventory)
        }
      }
    }
    }
  )
  sock.on('isShopping', (id) => {
    //working on
    ShopList.push(PlayersList[id])
    let index = UserList.indexOf(PlayersList[id])
    UserList.splice(index, 1)
    io.emit('update-players', { UserList, TreeList, RockList })
    io.to(sock.id).emit('wentShopping')
    io.emit('update-players', { UserList, TreeList, RockList })
  })
  sock.on('isCaveing', (id) => {
    //working on
    CaveList.push(PlayersList[id])
    let index = UserList.indexOf(PlayersList[id])
    UserList.splice(index, 1)
    io.emit('update-players', { UserList, TreeList, RockList })
    io.to(sock.id).emit('wentCaveing')
    io.emit('update-players', { UserList, TreeList, RockList })
  })
  sock.on('isCustomizing', (id) => {
    CustomList.push(PlayersList[id])
    let index = UserList.indexOf(PlayersList[id])
    UserList.splice(index, 1)
    io.emit('update-players', { UserList, TreeList, RockList })
    io.to(sock.id).emit('wentCustomizing')
    io.emit('update-players', { UserList, TreeList, RockList })
  })

  sock.on('changeY', (y) => {
    PlayersList[sock.id].y = y
    io.emit('update-players', {
      UserList,
      currentUser: PlayersList[sock.id],
      TreeList,
      RockList,
    })
  })
  sock.on('changeX', (y) => {
    PlayersList[sock.id].x = y
    io.emit('update-players', {
      UserList,
      currentUser: PlayersList[sock.id],
      TreeList,
      RockList,
    })
  })
  sock.on('changeCX', (y) => {
    PlayersList[sock.id].cx = y
    io.emit('update-players', {
      UserList,
      currentUser: PlayersList[sock.id],
      TreeList,
      RockList,
    })
  })

  sock.on('noLongerSwinging', () => {
    let currentUser = PlayersList[sock.id]
    if (currentUser != undefined) currentUser.isSwinging = false
  })
  sock.on('spawnOdds', () => {
    if (TreeList.length < 20) {
      let WiseOdds = Math.floor(Math.random() * 4000) + 1
      if (WiseOdds === 1) {
        let id = uuidv4()
        let x = Math.max(Math.random() * 850)
        TreeList.push({
          name: 'Wise and Mystical Tree',
          x,
          y: Math.max(Math.random() * (1500 - 800)) + 800,
          color: 'pink',
          width: 1,
          height: 140,
          leafColor: 'violet',
          leafSize: 20,
          hp: 500,
          isDamaged: false,
          id,
          woodMin: 1,
          woodMax: 2,
          woodValue: 5,
          img: 1,
          image:'/imgs/items/tree1',
        })
      }
      let OakOdds = Math.floor(Math.random() * 2000) + 1
      if (OakOdds === 1) {
        let id = uuidv4()
        let x = Math.max(Math.random() * (3000 - 1750)) + 1750
        TreeList.push({
          id,
          name: 'Oak Tree',
          x,
          y: Math.max(Math.random() * 800) + 1,
          color: 'brown',
          width: 1,
          height: 140,
          leafColor: 'green',
          leafSize: 20,
          hp: 100,
          isDamaged: false,
          woodMin: 1,
          woodMax: 1,
          woodValue: 1,
          img: 0,
          image:'/imgs/items/tree0',
        })
      }
      let MilltreeOdds = Math.floor(Math.random() * 16000) + 1
      if (MilltreeOdds === 1) {
        let id = uuidv4()
        let x = Math.max(Math.random() * 850)
        TreeList.push({
          name: 'Milltree',
          x,
          y: Math.max(Math.random() * (1500 - 800)) + 800,
          color: 'pink',
          width: 1,
          height: 140,
          leafColor: 'violet',
          leafSize: 20,
          hp: 2000,
          isDamaged: false,
          id,
          woodMin: 1,
          woodMax: 3,
          woodValue: 25,
          img: 2,
          image:'/imgs/items/tree2',
        })
      }
      let AmeritreeOdds = Math.floor(Math.random() * 15000) + 1
      if (AmeritreeOdds === 1) {
        let id = uuidv4()
        let x = Math.max(Math.random() * (3000 - 1750)) + 1750
        TreeList.push({
          name: 'Ameritree',
          x,
          y: Math.max(Math.random() * 800) + 1,
          color: 'pink',
          width: 1,
          height: 140,
          leafColor: 'violet',
          leafSize: 20,
          hp: 3000,
          isDamaged: false,
          id,
          woodMin: 1,
          woodMax: 4,
          woodValue: 50,
          img: 3,
          image:'/imgs/items/tree3',
        })
      }
      let MorganTreeManOdds = Math.floor(Math.random() * 15000) + 1
      if (MorganTreeManOdds === 1) {
        let id = uuidv4()
        let x = Math.max(Math.random() * (3000 - 1750)) + 1750
        TreeList.push({
          name: 'Morgan Treeman',
          x,
          y: Math.max(Math.random() * 800) + 1,
          color: 'pink',
          width: 1,
          height: 140,
          leafColor: 'violet',
          leafSize: 20,
          hp: 3000,
          isDamaged: false,
          id,
          woodMin: 1,
          woodMax: 4,
          woodValue: 50,
          img: 4,
          image:'/imgs/items/tree4',
        })
      }
      let YeeOdds = Math.floor(Math.random() * 100000) + 1
      if (YeeOdds === 1) {
        let id = uuidv4()
        let x = 995
        TreeList.push({
          name: 'The Yee Tree',
          x,
          y: 1115,
          color: 'pink',
          width: 1,
          height: 140,
          leafColor: 'violet',
          leafSize: 20,
          hp: 20000,
          isDamaged: false,
          id,
          woodMin: 1,
          woodMax: 5,
          woodValue: 500,
          img: 5,
          image:'/imgs/items/tree5',
        })
      }
    }
    if (RockList.length < 20) {
      let rockOdds = Math.floor(Math.random() * 2000) + 1
      if (rockOdds === 1) {
        let id = uuidv4()
        let x = Math.max(Math.random() * 1000) + 1
        RockList.push({
          id,
          type: 'main',
          name: 'Normal',
          x,
          y: Math.max(Math.random() * 300) + 1,
          color: 'gray',
          width: 5,
          height: 60,
          hp: 200,
          isDamaged: false,
          stoneMin: 1,
          stoneMax: 1,
          stoneValue: 2,
          img: 0,
          image:'/imgs/items/rock0',
        })
      }
      let diamondRockOdds = Math.floor(Math.random() * 5000) + 1
      if (diamondRockOdds === 1) {
        let id = uuidv4()
        let cx = Math.max(Math.random() * (2500 - 280)) + 280
        RockList.push({
          id,
          type: 'cave',
          name: 'Diamond',
          cx,
          cy: Math.max(Math.random() * 1000) + 425,
          color: 'gray',
          width: 5,
          height: 60,
          hp: 200,
          isDamaged: false,
          stoneMin: 1,
          stoneMax: 2,
          stoneValue: 5,
          img: 1,
          image:'/imgs/items/rock1',
        })
      }
      let meteorRock = Math.floor(Math.random() * 10000) + 1
      if (meteorRock === 1) {
        let id = uuidv4()
        let cx = Math.max(Math.random() * (2500 - 280)) + 280
        RockList.push({
          id,
          type: 'cave',
          name: 'Meteor',
          cx,
          cy: Math.max(Math.random() * 1000) + 425,
          color: 'gray',
          width: 5,
          height: 60,
          hp: 500,
          isDamaged: false,
          stoneMin: 1,
          stoneMax: 3,
          stoneValue: 10,
          img: 2,
          image:'/imgs/items/rock2',
        })
      }
      let RockyRock = Math.floor(Math.random() * 16000) + 1
      if (RockyRock === 1) {
        let id = uuidv4()
        let cx = Math.max(Math.random() * (2500 - 280)) + 280
        RockList.push({
          id,
          type: 'cave',
          name: 'Rocky Balboa',
          cx,
          cy: Math.max(Math.random() * 1000) + 425,
          color: 'gray',
          width: 5,
          height: 60,
          hp: 7000,
          isDamaged: false,
          stoneMin: 1,
          stoneMax: 4,
          stoneValue: 50,
          img: 5,
          image:'/imgs/items/rock5',
        })
      }
      let RockRock = Math.floor(Math.random() * 16000) + 1
      if (RockRock === 1) {
        let id = uuidv4()
        let cx = Math.max(Math.random() * (2500 - 280)) + 280
        RockList.push({
          id,
          type: 'cave',
          name: 'Rock and Roll',
          cx,
          cy: Math.max(Math.random() * 1000) + 425,
          color: 'gray',
          width: 5,
          height: 60,
          hp: 9000,
          isDamaged: false,
          stoneMin: 1,
          stoneMax: 5,
          stoneValue: 100,
          img: 3,
          image:'/imgs/items/rock3',
        })
      }
      let Dwayne = Math.floor(Math.random() * 20000) + 1
      if (Dwayne === 1) {
        let id = uuidv4()
        let cx = Math.max(Math.random() * (2500 - 280)) + 280
        RockList.push({
          id,
          type: 'cave',
          name: 'The Rock',
          cx,
          cy: Math.max(Math.random() * 1000) + 425,
          color: 'gray',
          width: 5,
          height: 60,
          hp: 10000,
          isDamaged: false,
          stoneMin: 1,
          stoneMax: 5,
          stoneValue: 200,
          img: 4,
          image:'/imgs/items/rock4',
        })
      }
    }
  })
  sock.on('hitARock', (data) => {
    let dmg = data.dmg
    for (rocko of RockList) {
      if (rocko.id === data.rock.id) {
        rocko.hp -= dmg
        if (dmg > 0) rocko.isDamaged = true
        if (rocko.hp <= 0) {
          for (let i = rocko.stoneMin; i < rocko.stoneMax; i++) {
            let odds = Math.floor(Math.random() * 11)
            if (odds > 5) {
              PlayersList[sock.id].inventory.push({
                name: rocko.type + ' stone',
                value: rocko.stoneValue,
                image: rocko.image,
              })
            }
          }
          PlayersList[sock.id].inventory.push({
            name: rocko.name + ' stone',
            value: rocko.stoneValue,
            image: rocko.image,
          })
          removeFromArray(RockList, rocko)
        }
      }
    }
  })
  sock.on('hitATree', (data) => {
    let dmg = data.dmg
    for (treeo of TreeList) {
      if (treeo.id === data.tree.id) {
        treeo.hp -= dmg
        if (dmg > 0) treeo.isDamaged = true
        if (treeo.hp <= 0) {
          for (let i = treeo.woodMin; i < treeo.woodMax; i++) {
            let odds = Math.floor(Math.random() * 11)
            if (odds > 5) {
              PlayersList[sock.id].inventory.push({
                name: treeo.name + ' wood',
                value: treeo.woodValue,
                image: treeo.image,
              })
            }
          }
          PlayersList[sock.id].inventory.push({
            name: treeo.name + ' wood',
            value: treeo.woodValue,
            image: treeo.image,
          })
          removeFromArray(TreeList, treeo)
        }
      }
    }
  })
  sock.on('getPlayerData', () => {
    let data = PlayersList[sock.id]
    io.to(sock.id).emit('data', data)
  })
  sock.on('disconnect', () => {
    removeFromArray(UserList, PlayersList[sock.id])
    PlayersList[sock.id] = undefined
    io.to(sock.id).emit('update-players', {
      UserList,
      currentUser: PlayersList[sock.id],
      TreeList,
      RockList,
    })
  })
})

function removeFromArray(array, value) {
  var idx = array.indexOf(value)
  if (idx !== -1) {
    array.splice(idx, 1)
  }
  return array
}

function fishingLake(sock) {
  console.log('lake')
  io.to(sock.id).emit('startedFishing')
  io.emit('update-players', { UserList, TreeList, RockList })
  lockMap.set((sock.id),true)
  clearTimeout(FishintimeList[sock.id])
  let fish = Lakefish.get(Math.floor(Math.random() * 7-Number(PlayersList[sock.id].upgrades[2])) +3+Number(PlayersList[sock.id].upgrades[2]))
  if(fish !== undefined) {
  FishintimeList[sock.id] = (setTimeout(() => {
    lockMap.delete(sock.id)
    sock.emit('caughtfish', fish)
    PlayersList[sock.id].inventory.push({
      name: fish.name + ' Fish',
      value: fish.value,
      image: fish.image,
    })
  }, Number(Math.floor(Math.random() * 10000) - PlayersList[sock.id].upgrades[1] * 1000)))
}
}

function fishingRiver(sock) {
  io.emit('update-players', { UserList, TreeList, RockList })
  io.to(sock.id).emit('startedFishing')
  console.log('river')
  lockMap.set((sock.id),true)
  clearTimeout(FishintimeList[sock.id])
  let fish = Lakefish.get(Math.floor(Math.random() * 6 -Number(PlayersList[sock.id].upgrades[2]) ) +1+Number(PlayersList[sock.id].upgrades[2]))
  if(fish !== undefined) {
  FishintimeList[sock.id] = (setTimeout(() => {
    lockMap.delete(sock.id)
    sock.emit('caughtfish', fish)
    PlayersList[sock.id].inventory.push({
      name: fish.name + ' Fish',
      value: fish.value,
      image: fish.image,
    })
  }, Number(Math.floor(Math.random() * 10000) - PlayersList[sock.id].upgrades[1] * 1000)))
}
}