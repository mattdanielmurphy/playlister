require('dotenv').config()

let env = {
	mode: 'development',
	api: { url: 'http://localhost' },
	redirect: { uri: 'http://localhost/api/auth' },
	app: { url: 'http://localhost:3000' }
}

// comment the rest out for development mode
// env.api.url = 'https://playlist.mattmurphy.ca'
// env.app.url = 'https://playlist.mattmurphy.ca'
// env.redirect.uri = 'https://playlist.mattmurphy.ca/api/auth'

module.exports = { env }
