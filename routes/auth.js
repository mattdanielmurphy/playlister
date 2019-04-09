const parseQueryString = require('./utils')
const fetch = require('node-fetch')
const { Dropbox } = require('dropbox')
require('dotenv').config()
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.SECRET_KEY)

class Auth {
	async getHashTokenFromCode(code) {
		const dbx = new Dropbox({
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			fetch
		})
		const accessToken = await dbx.getAccessTokenFromCode('http://localhost/api/auth', code)
		return cryptr.encrypt(accessToken)
	}
	decryptTokenHash(tokenHash) {
		return cryptr.decrypt(tokenHash)
	}
	async setupUser(dbx) {
		const { account_id } = await dbx.usersGetCurrentAccount()
		const newUser = { _id: account_id }
		// will create new user if not already there
		fetch('http://localhost/api/users', {
			method: 'post',
			body: JSON.stringify(newUser),
			headers: { 'Content-Type': 'application/json' }
		}).then(async (res) => {
			res = await res.json()
			if (res.error) console.log(res.error)
			else console.log('New user created', account_id)
		})
	}
	async getAuthorizationUrl() {
		return await new Dropbox({ clientId: process.env.CLIENT_ID, fetch }).getAuthenticationUrl(
			'http://localhost/api/auth',
			null,
			'code'
		)
		// const tokenHash = cryptr.encrypt(accessToken)
		// Cookies.set('tokenHash', tokenHash)
	}
	async authenticateToken(accessToken) {
		const dbx = new Dropbox({
			accessToken,
			fetch
		})
		return await dbx
			.filesListFolder({ path: '' })
			.then(async (res) => {
				console.log(res)
				await this.setupUser(dbx)
				return accessToken
			})
			.catch((err) => {
				console.log('ERR', err)
				return null
			})
	}
}

const auth = new Auth()

module.exports = auth
