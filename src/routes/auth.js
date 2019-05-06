const fetch = require('node-fetch')
const { Dropbox } = require('dropbox')
const Cryptr = require('cryptr')
const { env } = require('../server-env')
const cryptr = new Cryptr(env.token.secret)

class Auth {
	async getHashTokenFromCode(code) {
		const dbx = new Dropbox({
			clientId: env.client.id,
			clientSecret: env.client.secret,
			fetch
		})
		const accessToken = await dbx.getAccessTokenFromCode(`${env.api.url}/api/auth`, code)
		return cryptr.encrypt(accessToken)
	}
	decryptTokenHash(tokenHash) {
		return cryptr.decrypt(tokenHash)
	}
	async setupUser(dbx) {
		const { account_id } = await dbx.usersGetCurrentAccount()
		const newUser = { _id: account_id }
		// will create new user if not already there
		fetch(`${env.api.url}/api/users`, {
			method: 'post',
			body: JSON.stringify(newUser),
			headers: { 'Content-Type': 'application/json' }
		}).then(async (res) => {
			res = await res.json()
			if (res.error) {
				// don't display error if duplicate key error (try to create new user but user already exists)
				if (!res.error.errmsg.includes('E11000')) console.log(res.error)
			} else console.log('New user created', account_id)
		})
	}
	async getAuthorizationUrl() {
		return await new Dropbox({ clientId: env.client.id, fetch }).getAuthenticationUrl(
			env.redirect.uri,
			null,
			'code'
		)
	}
	async authenticateToken(accessToken) {
		const dbx = new Dropbox({
			accessToken,
			fetch
		})
		return await dbx
			.filesListFolder({ path: '' })
			.then(async () => {
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
