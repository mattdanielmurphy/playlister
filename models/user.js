const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlaylistSchema = new Schema({
	name: { type: String, required: true },
	date: { type: Date, default: Date.now },
	songs: { type: Object, required: true },
	_id: { type: String, required: true }
})

const UserSchema = new Schema({
	date: { type: Date, default: Date.now },
	playlists: { type: [ PlaylistSchema ], default: [] },
	_id: { type: String, required: true }
})

const User = mongoose.model('user', UserSchema)

module.exports = User
