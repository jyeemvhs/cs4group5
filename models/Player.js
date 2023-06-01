var mongoose = require('mongoose')

//Schema is a decription (the definition) of the mongoDB document.
var infoSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  x: { type: Number },
  y: { type: Number },
  cx: { type: Number },
  cy: { type: Number },
  speed: { type: Number },
  coins: { type: Number },
  inventory: { type: Array },
  holding: { type: String },
  facing: { type: String },
  isSwinging: { type: Boolean },
  face: { type: Number },
  color: { type: String },
  upgrades: { type: Array },
  location: { type: String },
})

var Player = mongoose.model('Player', infoSchema)

module.exports = Player
