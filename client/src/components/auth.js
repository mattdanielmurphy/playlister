import { parseQueryString } from './utils'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
const { Dropbox } = require('dropbox')

class Auth {
	constructor() {
		this.CLIENT_ID = 'kp2273iqykx8esz'
	}
	showPageSection(id) {
		document.getElementById(id).style.display = 'block'
	}
	getAccessToken() {
		return parseQueryString(window.location.hash).access_token || Cookies.get('accessToken')
	}
	askForAuthorization() {
		this.showPageSection('pre-auth-section')
		const authUrl = new Dropbox({ clientId: this.CLIENT_ID, fetch }).getAuthenticationUrl(
			'http://localhost:3000/auth'
		)
		document.getElementById('authlink').href = authUrl
	}
	setupUserIfNoMatchingCookie = async (dbx) => {
		// MUST ENCRYPT COOKIES BEFORE ANYONE USES THIS FOR IMPORTANT STUFF!!!
		if (Cookies.get('accessToken' !== this.getAccessToken()) || !Cookies.get('accessToken')) {
			Cookies.set('accessToken', this.getAccessToken())
			const { account_id } = await dbx.usersGetCurrentAccount()
			const newUser = { _id: account_id }
			// will create new user if not already there
			fetch('http://localhost/api/users', {
				method: 'post',
				body: JSON.stringify(newUser),
				headers: { 'Content-Type': 'application/json' }
			}).then(async (res) => {
				res = await res.json()
				if (res.error) console.log(res)
				else console.log('New user created', account_id)
			})
		}
	}
	async authenticate() {
		const dbx = new Dropbox({ accessToken: this.getAccessToken(), fetch })
		// let authenticated = false
		let authenticated = await dbx
			.filesListFolder({ path: '' })
			.then(async () => {
				authenticated = true
				await this.setupUserIfNoMatchingCookie(dbx)
				return true
			})
			.catch((err) => false)
		return authenticated ? dbx : false
	}
}

const auth = new Auth()

export default auth
