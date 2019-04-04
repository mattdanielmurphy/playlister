const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlaylistSchema = new Schema({
	name: { type: String, required: true },
	date: { type: Date, default: Date.now },
	songs: { type: Object, required: true },
	index: { type: Number, required: true }
})

const Playlist = mongoose.model('playlist', PlaylistSchema)

module.exports = Playlist
