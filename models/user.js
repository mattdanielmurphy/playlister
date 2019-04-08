const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlaylistSchema = new Schema({
	name: { type: String, required: true },
	date: { type: Date, default: Date.now },
	songs: { type: Object, required: true },
	index: { type: Number, required: true }
})

const UserSchema = new Schema({
	dropboxId: { type: String, required: true },
	date: { type: Date, default: Date.now },
	index: { type: Number, required: true },
	playlists: [ PlaylistSchema ]
})

const User = mongoose.model('user', UserSchema)

module.exports = User
