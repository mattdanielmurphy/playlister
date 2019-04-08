const router = require('express').Router()
const User = require('../models/user')

async function getLastPlaylistIndex(userIndex) {
	let lastPlaylistIndex = 0
	await User.findOne({ index: userIndex }, {}, { sort: { date: -1 } }).then(
		(playlist) => (lastPlaylistIndex = playlist.index)
	)
	return lastPlaylistIndex
}

async function getLastUserIndex() {
	let lastUserIndex = 0
	await User.findOne({}, {}, { sort: { date: -1 } }).then((user) => (lastUserIndex = user.index))
	return lastUserIndex
}

// get playlists of user
router.get('/:userId/playlists', (req, res, next) => {
	User.findOne({ index: req.params.userId }).then((record) => res.json(record.playlists))
})

// create new playlist
router.post('/:userId/playlists', async (req, res, next) => {
	const userIndex = req.params.userId
	const lastPlaylistIndex = await getLastPlaylistIndex(userIndex)
	const playlist = req.body
	playlist.index = lastPlaylistIndex + 1

	User.findOne({ index: userIndex }).then((record) => {
		record.playlists.push(playlist)
		record.save()
		res.json(record)
	})
})

// create new user
router.post('/users', async (req, res, next) => {
	// add indexes to each playlist
	if (req.body.playlists) {
		req.body.playlists = req.body.playlists.map((playlist, i) => {
			playlist.index = i + 1
			return playlist
		})
	}
	// add unused index to user
	req.body.index = (await getLastUserIndex()) + 1
	User.create(req.body).then((data) => res.json(data)).catch((err) => console.log(err))
})

// get a playlist by its id
router.get('/:userId/playlists/:playlistId', (req, res, next) => {
	const userIndex = req.params.userId
	const playlistIndex = req.params.playlistId
	User.findOne({ index: userIndex, 'playlists.index': playlistIndex }).then((record) => res.json(record))
})

// delete a playlist
router.delete('/:userId/playlists/:playlistId', (req, res, next) => {
	const userIndex = req.params.userId
	const playlistIndex = req.params.playlistId
	User.updateOne({ index: userIndex }, { $pull: { playlists: { index: playlistIndex } } })
		.then((data) => res.json(data))
		.catch(next)
})

module.exports = router
