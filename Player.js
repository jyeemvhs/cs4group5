let Player = function (username, x, y, cx, cy, speed, id, coins, inventory, holding, facing, isSwinging, face, upgrades, color) {
  this.username = username,
  this.x = x,
  this.y = y,
  this.cx = cx,
  this.cy = cy,
  this.speed = speed,
  this.id = id,
  this.coins = coins,
  this.inventory = inventory,
  this.holding = holding,
  this.facing = facing,
  this.isSwinging = isSwinging,
  this.face = face,
  this.upgrades = upgrades
  this.color = color
}

module.exports = Player
