const router = require('express').Router()
const User = require('../models/user')

async function getLastPlaylistId(userId) {
	let lastPlaylistId = 0
	await User.findById(userId).then(({ playlists }) => {
		lastPlaylistId = playlists.length > 0 ? playlists[playlists.length - 1]._id : 0
	})
	return lastPlaylistId
}

// create new playlist
router.post('/:userId/playlists', async (req, res, next) => {
	const userId = req.params.userId
	const lastPlaylistId = await getLastPlaylistId(userId)
	const playlist = req.body
	playlist._id = Number(lastPlaylistId) + 1

	User.findById(userId).then((user) => {
		user.playlists.push(playlist)
		user.save()
		res.json(playlist)
	})
})

// delete a playlist
router.delete('/:userId/playlists/:playlistId', ({ params }, res, next) => {
	const userId = params.userId
	const playlistId = params.playlistId
	User.updateOne({ _id: userId }, { $pull: { playlists: { _id: playlistId } } })
		.then((data) => res.json(data))
		.catch(next)
})

// replace playlist: PUT
router.put('/:userId/playlists/:playlistId', (req, res, next) => {
	const userId = req.params.userId
	const playlistId = req.params.playlistId
	const newPlaylist = req.body
	newPlaylist._id = playlistId
	User.findById(userId).then((user) => {
		const oldPlaylist = user.playlists.id(playlistId).remove()
		user.playlists.push(newPlaylist)
		user.save()
	})
})

// get all playlists of user
router.get('/:userId/playlists', ({ params }, res, next) => {
	User.findById(params.userId).then((user) => res.json(user.playlists))
})

// get a playlist by its id
router.get('/:userId/playlists/:playlistId', ({ params }, res, next) => {
	const userId = params.userId
	const playlistId = params.playlistId
	User.findById(userId).then((user) => {
		const playlist = user.playlists.id(playlistId)
		res.json(playlist)
	})
})

// create new user
router.post('/users', async ({ body }, res, next) => {
	// add IDs to each playlist if playlists object provided
	if (body.playlists) {
		body.playlists = body.playlists.map((playlist, i) => {
			playlist._id = i + 1
			return playlist
		})
	}
	User.create(body).then((data) => res.json(data)).catch((err) => res.json({ error: err }))
})

module.exports = router
