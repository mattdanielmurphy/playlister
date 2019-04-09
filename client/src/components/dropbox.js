import fetch from 'node-fetch'
import { Dropbox } from 'dropbox'

class DropboxObj {
	getDbx = () => new Dropbox({ accessToken: this.accessToken, fetch })
	getUser = async () => {
		return await this.getDbx().usersGetCurrentAccount().then((res) => res)
	}
	getTempLink = async (songPath) => {
		return await this.getDbx().filesGetTemporaryLink({ path: songPath }).then(({ link }) => link)
	}
	getSongs = async () => {
		const songs = []
		await this.getDbx()
			.filesListFolder({ path: '' })
			.then((res) => {
				for (let i in res.entries) songs.push(res.entries[i])
			})
			.catch((error) => console.error(error))
		return songs
	}
	getAuthorizationUrl = async () =>
		await fetch('http://localhost/api/get-auth-url').then(async (res) => {
			const { url } = await res.json()
			return url
		})
	authenticate = async (tokenOrHash) => {
		console.log(tokenOrHash)
		return await fetch('http://localhost/api/auth', {
			method: 'post',
			body: JSON.stringify(tokenOrHash),
			headers: { 'Content-Type': 'application/json' }
		}).then(async (res) => {
			const accessToken = await res.json()
			console.log(accessToken)
			if (accessToken) this.accessToken = accessToken
			return res
		})
		// Cookies.set('accessToken', this.getAccessToken())
	}
}

const dropbox = new DropboxObj()

export default dropbox
