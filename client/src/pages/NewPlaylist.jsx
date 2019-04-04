import React, { Component } from 'react'
import Songs from '../components/Songs'
import fetch from 'node-fetch'
import mongoKey from 'mongo-key-escape'

class NewPlaylist extends Component {
	state = {
		playlist: { songs: {} },
		error: undefined
	}
	addSongToPlaylist(song) {
		const playlist = this.state.playlist
		playlist.songs[song.id] = song
		this.setState({ playlist })
	}
	removeSongFromPlaylist(song) {
		const playlist = this.state.playlist
		delete playlist.songs[song.id]
		this.setState({ playlist })
	}
	async handleSubmit(e) {
		e.preventDefault()
		const name = e.target['playlist-name'].value
		const songs = {}
		Object.keys(this.state.playlist.songs).forEach((song) => {
			songs[song] = {}
			Object.keys(this.state.playlist.songs[song]).forEach((key) => {
				songs[song][mongoKey.escape(key)] = this.state.playlist.songs[song][key]
			})
		})

		if (Object.values(this.state.playlist.songs).length === 0) {
			this.setState({ error: 'Error: Playlist must contain at least one track.' })
		} else {
			e.target['playlist-name'].value = ''

			let index
			await fetch('http://localhost/api/playlists/last-index')
				.then((res) => res.json())
				.then((res) => (index = res + 1))
			const playlist = { name, songs, index }
			console.log('adding', playlist)

			fetch('http://localhost/api/playlists', {
				method: 'POST',
				body: JSON.stringify(playlist),
				headers: { 'Content-Type': 'application/json' }
			}).then((res) => console.log(res))

			if (this.state.error) this.setState({ error: undefined })
		}
	}
	error() {
		return <div className="error">{this.state.error}</div>
	}
	render = () => (
		<main>
			<h1>Create A Playlist</h1>
			<Songs
				dbx={this.props.dbx}
				addSongToPlaylist={(song) => this.addSongToPlaylist(song)}
				removeSongFromPlaylist={(song) => this.removeSongFromPlaylist(song)}
			/>
			<form id="create-playlist" onSubmit={(e) => this.handleSubmit(e)}>
				{this.state.error && this.error()}
				<input type="text" name="playlist-name" placeholder="Playlist Title" />
				<button>Create playlist</button>
			</form>
		</main>
	)
}
export default NewPlaylist
