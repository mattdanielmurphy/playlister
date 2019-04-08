const router = require('express').Router()
const User = require('../models/user')

// router.get('/playlists', (req, res, next) => {
// 	Playlist.find().then((data) => res.json(data)).catch(next)
// })

router.get('/:id/playlists', (req, res, next) => {
	User.findOne({ dropboxId: req.params.id }).then((record) => res.json(record.playlists))
})

router.post('/users', (req, res, next) => {
	User.create(req.body).then((data) => res.json(data))
})

router.get('/playlists/last-index', (req, res, next) => {
	// If catches, then first playlist is being added, and since it will increment this index, return 0
	Playlist.findOne({}, {}, { sort: { date: -1 } }).then((data) => res.json(data.index)).catch(() => res.json(0))
})

router.get('/playlists/:id', (req, res, next) => {
	Playlist.findOne({ index: req.params.id }).then((data) => res.json(data)).catch(next)
})

router.post('/playlists', (req, res, next) => {
	Playlist.create(req.body).then((data) => res.json(data)).catch(next)
})

router.delete('/playlists/:id', (req, res, next) => {
	Playlist.findOneAndDelete({ index: req.params.id }).then((data) => res.json(data)).catch(next)
})

module.exports = router
