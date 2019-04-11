import React, { Component } from 'react'
import Songs from '../components/Songs'
import fetch from 'node-fetch'
import mongoKey from 'mongo-key-escape'
import dropbox from '../components/dropbox'
import { Button, Form } from 'semantic-ui-react'

class NewPlaylist extends Component {
	state = {
		playlist: { songs: {} },
		error: undefined,
		loading: false
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
	async createPlaylist(name, songs) {
		this.setState({ loading: true })
		const playlist = { name, songs }
		const { account_id } = await dropbox.getUser()
		fetch(`http://localhost/api/${account_id}/playlists`, {
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
			this.createPlaylist(name, songs)
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
			<Form id="create-playlist" onSubmit={(e) => this.handleSubmit(e)}>
				{this.state.error && this.error()}
				{this.state.added && (
					<p>
						Playlist created! Listen to it <a href={this.state.link}>here</a>.
					</p>
				)}
				<Form.Group>
					<Form.Input type="text" name="playlist-name" placeholder="Playlist Title" />
					<Button loading={this.state.loading}>Create playlist</Button>
				</Form.Group>
			</Form>
		</main>
	)
}
export default NewPlaylist
