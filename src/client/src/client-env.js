require('dotenv').config()

const env = {
	mode: 'development',
	api: { url: 'http://localhost', port: 80 },
	redirect: { uri: 'http://localhost/api/auth' },
	app: { url: 'http://localhost:3000' }
}

module.exports = { env }
