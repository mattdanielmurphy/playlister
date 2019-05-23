import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Songs from '../components/Songs'
import PlaylistInProgress from '../components/PlaylistInProgress'
import dropbox from '../components/dropbox'
import fetch from 'node-fetch'
import { Button, Form } from 'semantic-ui-react'
import mongoKey from 'mongo-key-escape'
import { env } from '../client-env'

class NewPlaylist extends Component {
	state = {
		playlist: { songs: [] },
		error: undefined,
		loading: false,
		songIndex: -1
	}
	addSongToPlaylist(song) {
		const playlist = this.state.playlist
		playlist.songs.push(song)
		this.setState({ playlist })
	}
	removeSongFromPlaylist(song) {
		const playlist = this.state.playlist
		let index = playlist.songs.findIndex((v) => v.id === song.id)
		playlist.songs.splice(index, 1)
		this.setState({ playlist })
	}
	async getSongLinks(songs) {
		const existingLinks = await dropbox.getSharedLinks()
		songs.forEach(async (song) => {
			const matchedLink = existingLinks.find((link) => link.id === song.id)
			song.source = matchedLink ? matchedLink.url : await dropbox.getLink(song.path_lower)
			song.source = song.source.replace(/\?dl=0/, '').replace(/www.dropbox/, 'dl.dropboxusercontent')
			// make streamable as a file
			song.source += '?raw=1'
		})
		return songs
	}
	async createPlaylist(name, songs) {
		this.setState({ loading: true })
		songs = await this.getSongLinks(songs)
		const playlist = { name, songs }
		const { account_id } = await dropbox.getUser()
		fetch(`${env.api.url}/api/${account_id}/playlists`, {
			method: 'POST',
			body: JSON.stringify(playlist),
			headers: { 'Content-Type': 'application/json' }
		}).then(async (res) => {
			const { _id } = await res.json()
			console.log('Playlist created', playlist)
			this.setState({
				added: true,
				link: `/playlists/${_id}`,
				loading: false
			})
		})

		if (this.state.error) this.setState({ error: undefined })
	}
	async handleSubmit(e) {
		e.preventDefault()
		// const name = e.target['playlist-name'].value.trim()
		const inputEl = document.getElementsByName('playlist-name')[0]
		const name = inputEl.value.trim()
		const songs = []
		this.state.playlist.songs.forEach((song) => {
			const thisSong = {}
			Object.keys(song).forEach((key) => {
				const escapedKey = mongoKey.escape(key)
				thisSong[escapedKey] = song[key]
			})
			songs.push(thisSong)
		})

		if (Object.values(this.state.playlist.songs).length === 0) {
			this.setState({ error: 'Error: Playlist must contain at least one track.' })
		} else if (name.length < 1) {
			this.setState({ error: 'Error: Playlist must have a name (set it at the top).' })
		} else {
			this.createPlaylist(name, songs)
		}
	}
	error() {
		return <div className="error">{this.state.error}</div>
	}
	updatePlaylistSongs(songs) {
		const playlist = this.state.playlist
		playlist.songs = songs
		this.setState({ playlist })
	}
	render = () => (
		<main id="create-playlist">
			<div className="top-heading heading no-nav-heading">
				<h2>creating</h2>
			</div>
			<div id="content-wrapper">
				<Songs
					dbx={this.props.dbx}
					addSongToPlaylist={(song) => this.addSongToPlaylist(song)}
					removeSongFromPlaylist={(song) => this.removeSongFromPlaylist(song)}
					playlistSongs={this.state.playlist.songs}
				/>
				<PlaylistInProgress
					songs={this.state.playlist.songs}
					addSongToPlaylist={(song) => this.addSongToPlaylist(song)}
					removeSongFromPlaylist={(song) => this.removeSongFromPlaylist(song)}
					updatePlaylistSongs={(songs) => this.updatePlaylistSongs(songs)}
				/>
				<Form id="create-playlist" onSubmit={(e) => this.handleSubmit(e)}>
					{this.state.error && this.error()}
					{this.state.added && (
						// <p>
						// 	Playlist created! Listen to it <a href={this.state.link}>here</a>.
						// </p>
						<Redirect to={this.state.link} />
					)}
					<input
						className="playlist-title-input"
						name="playlist-name"
						type="text"
						placeholder="Click to set playlist title"
					/>
					<Button className="button" loading={this.state.loading}>
						Create playlist
					</Button>
				</Form>
			</div>
		</main>
	)
}
export default NewPlaylist
