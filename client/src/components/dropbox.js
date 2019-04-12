import fetch from 'node-fetch'
import { Dropbox } from 'dropbox'

class DropboxObj {
	getDbx = () => new Dropbox({ accessToken: this.accessToken, fetch })
	getUser = async () => {
		return await this.getDbx().usersGetCurrentAccount().then((res) => res)
	}
	getSharedLinks = async () => await this.getDbx().sharingListSharedLinks().then(({ links }) => links)
	getLink = async (songPath) => {
		// return await this.getDbx().filesGetTemporaryLink({ path: songPath }).then(({ link }) => link)
		return await this.getDbx()
			.sharingCreateSharedLinkWithSettings({
				path: songPath,
				settings: { requested_visibility: { '.tag': 'public' } }
			})
			.then((res) => {
				// report if resolved_visibility is not 'public': links won't be publically listenable
				return res.url
			})
			.catch((rej) => console.log('Rejected:', rej))
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
		return await fetch('http://localhost/api/auth', {
			method: 'post',
			body: JSON.stringify(tokenOrHash),
			headers: { 'Content-Type': 'application/json' }
		}).then(async (res) => {
			const accessToken = await res.json()
			if (accessToken) this.accessToken = accessToken
			return res
		})
	}
}

const dropbox = new DropboxObj()

export default dropbox
