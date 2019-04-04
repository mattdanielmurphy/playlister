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
	async authenticate() {
		const dbx = new Dropbox({ accessToken: this.getAccessToken(), fetch })
		let authenticated = false
		const test = new Promise((resolve, reject) => {
			dbx
				.filesListFolder({ path: '' })
				.then(() => {
					// MUST ENCRYPT COOKIES BEFORE ANYONE USES THIS FOR IMPORTANT STUFF!!!
					if (Cookies.get('accessToken' !== this.getAccessToken()) || !Cookies.get('accessToken'))
						Cookies.set('accessToken', this.getAccessToken())
					resolve()
				})
				.catch((err) => {
					console.log(err)
					reject('rejected')
				})
		})
			.then(() => (authenticated = true))
			.catch((err) => {})
		await test
		return authenticated ? dbx : false
	}
}

const auth = new Auth()

export default auth
