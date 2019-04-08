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
		const name = e.target['playlist-name'].value.trim()
		const songs = {}
		Object.keys(this.state.playlist.songs).forEach((song) => {
			songs[song] = {}
			Object.keys(this.state.playlist.songs[song]).forEach((key) => {
				songs[song][mongoKey.escape(key)] = this.state.playlist.songs[song][key]
			})
		})

		if (Object.values(this.state.playlist.songs).length === 0) {
			this.setState({ error: 'Error: Playlist must contain at least one track.' })
		} else if (name.length < 1) {
			this.setState({ error: 'Error: Playlist must have a name.' })
		} else {
			e.target['playlist-name'].value = ''

			const playlist = { name, songs }
			console.log('adding', playlist)

			const { account_id } = await this.props.dbx.usersGetCurrentAccount()
			fetch(`http://localhost/api/${account_id}/playlists`, {
				method: 'POST',
				body: JSON.stringify(playlist),
				headers: { 'Content-Type': 'application/json' }
			}).then(async (res) => {
				const { _id } = await res.json()
				console.log(res)
				this.setState({
					added: true,
					link: `/playlists/${_id}`
				})
			})

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
				{this.state.added && (
					<p>
						Playlist created! Listen to it <a href={this.state.link}>here</a>.
					</p>
				)}
				<input type="text" name="playlist-name" placeholder="Playlist Title" />
				<button>Create playlist</button>
			</form>
		</main>
	)
}
export default NewPlaylist
