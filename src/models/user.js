const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlaylistSchema = new Schema({
	name: { type: String, required: true },
	date: { type: Date, default: Date.now },
	songs: { type: Array, required: true },
	_id: { type: String, required: true }
})

const PlaylistReferenceSchema = new Schema({
	_id: { type: String, required: true }
})

const UserSchema = new Schema({
	date: { type: Date, default: Date.now },
	playlists: { type: [ PlaylistReferenceSchema ], default: [] },
	_id: { type: String, required: true }
})

const User = mongoose.model('user', UserSchema)
const Playlist = mongoose.model('playlist', PlaylistSchema)

module.exports = { User, Playlist }
