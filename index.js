const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const routes = require('./routes/api')
const path = require('path')
require('dotenv').config()

const port = process.env.PORT || 80

mongoose
	.connect('mongodb://localhost:27017/playlister', { useNewUrlParser: true })
	.then(() => console.log('Database connected successfully'))
	.catch((err) => console.log(err))

// override decprecated promise
mongoose.Promise = global.Promise

// must remain at the top for cross-origin requests to be allowed
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})

// must remain above catch-all for other routes below which are all sent to index, to be handled by react router
app.use('/api', routes)

// production mode
if (process.env.NODE_ENV === 'production') {
	console.log('production')
	app.use(express.static(path.join(__dirname, 'client/build')))
	app.get('*', (req, res) => res.sendFile('client/build/index.html', { root: __dirname }))
}

// build mode
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/public/index.html'))
})

app.use(bodyParser.json())

app.use((err, req, res, next) => {
	console.log(err)
	next()
})

app.listen(port, () => {
	console.log(`Serving running on port ${port}`)
})
