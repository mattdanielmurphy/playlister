const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const apiRouter = require('./routes/api')
const cors = require('cors')
const { env } = require('./env')
// comment out for development mode
// const functions = require('firebase-functions')

const app = express()

mongoose
	.connect(`mongodb+srv://mattmurphy:${env.db.password}@cluster0-1psk0.gcp.mongodb.net/test?retryWrites=true`, {
		dbName: 'playlister',
		useNewUrlParser: true
	})
	.then(() => console.log('Database connected successfully'))
	.catch((err) => console.log(err))

// override decprecated promise
mongoose.Promise = global.Promise

app.use(cors({ origin: true }))

// don't move lower
app.use(bodyParser.json())

app.use('/api', apiRouter)

// production mode
// comment out for development mode
// let api = functions.https.onRequest(app)
// uncomment for development mode
app.listen(80, () => console.log(`Example app listening on port ${80}!`))

// comment out for development mode
// module.exports = { api }
