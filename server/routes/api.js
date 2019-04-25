const router = require('express').Router()
const { Playlist, User } = require('../models/user')
const auth = require('./auth')
const uuid = require('short-uuid')
const { env } = require('../env')

// dropbox
router.get('/auth', async (req, res, next) => {
	console.log('get auth')
	const code = req.query.code
	if (code) {
		const tokenHash = await auth.getHashTokenFromCode(code).catch((err) => console.log('Err:', err))
		console.log(env.app.url)
		res.redirect(`${env.app.url}/?tokenHash=${tokenHash}`)
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
	const playlist = req.body
	playlist._id = uuid.generate()

	User.findById(userId).then((user) => {
		user.playlists.push({ _id: playlist._id })
		user.save()
		console.log('created playlist', playlist)
	})
	Playlist.create(playlist).then((data) => res.json(data)).catch((err) => res.json({ error: err }))
})

// delete a playlist
router.delete('/:userId/playlists/:playlistId', (req, res, next) => {
	const userId = req.params.userId
	const playlistId = req.params.playlistId
	const tokenHash = req.body.tokenHash
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
	let playlistIds
	User.findById(params.userId).then((user) => {
		// if no playlists return an empty array
		playlistIds = user.playlists ? user.playlists : []

		// playlistIds = playlistIds.map((playlistId) => playlistId)
		Playlist.find(
			{
				_id: { $in: playlistIds }
			},
			function(err, docs) {
				res.json(docs)
			}
		)
	})
})

// get a playlist by its id
router.get('/playlists/:playlistId', ({ params }, res, next) => {
	const playlistId = params.playlistId
	Playlist.findById(playlistId).then((playlist) => res.json(playlist))
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
