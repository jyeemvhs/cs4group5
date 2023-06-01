var Player = require('./models/Player')

let myDatabase = function () {}

myDatabase.prototype.postData = function (data, res) {
  let obj = {
    username: data.username,
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
  }
  Player.create(obj, function (error, info) {
    if (error) {
      return res.json({ error: true })
    }
    return res.json({
      error: false,
      newPlayer: obj,
    })
  })
}

myDatabase.prototype.getData = function (username, res) {
  Player.find({ username: username }, function (error, info) {
    if (error) {
      return res.json({ error: true })
    } else if (info == null) {
      return res.json({ error: true })
    }

    if (info.length == 1)
      return res.json({
        error: false,
        x: info[0].x,
        y: info[0].y,
        cx: info[0].cx,
        cy: info[0].cy,
        speed: info[0].speed,
        id: info[0].id,
        coins: info[0].coins,
        inventory: info[0].inventory,
        holding: info[0].holding,
        facing: info[0].facing,
        isSwinging: info[0].isSwinging,
        face: info[0].face,
        upgrades: info[0].upgrades,
        color: info[0].color,
      })
    else return res.json({ error: true })
  })
}

myDatabase.prototype.putData = function (data, res) {
  Player.findOneAndUpdate(
    { username: data.username },
    {
      x: data.x,
      y: data.y,
      cx: data.cx,
      cy: data.cy,
      speed: data.speed,
      id: data.id,
      coins: data.coins,
      inventory: data.inventory,
      holding: data.holding,
      facing: data.facing,
      isSwinging: data.isSwinging,
      face: data.face,
      upgrades: data.upgrades,
      color: data.color,
    },
    function (error, oldData) {
      if (error) {
        return res.json({ error: true })
      } else if (oldData == null) {
        return res.json({ error: true })
      }
      return res.json({ error: false })
    }
  )
}

module.exports = myDatabase
