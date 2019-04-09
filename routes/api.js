const router = require('express').Router()
const User = require('../models/user')
const auth = require('./auth')

async function getLastPlaylistId(userId) {
	let lastPlaylistId = 0
	await User.findById(userId).then(({ playlists }) => {
		lastPlaylistId = playlists.length > 0 ? playlists[playlists.length - 1]._id : 0
	})
	return lastPlaylistId
}

// dropbox
router.get('/auth', async (req, res, next) => {
	const code = req.query.code
	if (code) {
		const tokenHash = await auth.getHashTokenFromCode(code)
		res.redirect(`http://localhost:3000/?tokenHash=${tokenHash}`)
	}
})

router.post('/auth', async (req, res, next) => {
	let token = req.body.token
	const tokenHash = req.body.tokenHash
	if (token) {
		const accessToken = await auth.authenticateToken(token)
		res.json(accessToken)
	} else if (tokenHash) {
		token = auth.decryptTokenHash(tokenHash)
		const accessToken = await auth.authenticateToken(token)
		res.json(accessToken)
	}
})

router.get('/get-auth-url', async (req, res, next) => {
	const url = await auth.getAuthorizationUrl()
	res.json({ url })
})

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
	User.findById(params.userId).then((user) => {
		// if no playlists return an empty array
		playlists = user.playlists ? user.playlists : []
		res.json(playlists)
	})
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
