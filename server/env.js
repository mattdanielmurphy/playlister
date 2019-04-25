// comment out for development mode
// const functions = require('firebase-functions')
require('dotenv').config()

let { env } = require('./client/src/env')

env.token = { secret: process.env.TOKEN_SECRET }

env.client = {
	id: process.env.CLIENT_ID,
	secret: process.env.CLIENT_SECRET
}

env.db = { password: process.env.DB_PASSWORD }

// comment out for development mode
// env = functions.config()

module.exports = { env }
