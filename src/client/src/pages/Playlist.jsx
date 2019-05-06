import React, { Component } from 'react'
import fetch from 'node-fetch'

import Player from '../components/Player'
import Loader from '../components/Loader'
import { env } from '../client-env'
import Back from '../components/Back'

class Playlist extends Component {
	state = {
		id: this.props.match.params.id,
		name: '',
		songs: [],
		currentSongIndex: 0
	}
	setCurrentSongIndex = (i) => this.setState({ currentSongIndex: i })
	getSongs() {
		fetch(`${env.api.url}/api/playlists/${this.state.id}`)
			.then(async (res) => {
				const { songs, name, date } = await res.json()
				this.setState({ songs: Object.values(songs), name, date })
			})
			.catch(() => this.setState({ error: 'Error: Playlist not found!' }))
	}
	setPlaylistState = (state) => this.setState(state)
	componentWillMount = () => {
		this.getSongs()
	}
	render = () =>
		this.state.error ? (
			<div className="top-heading heading">
				<Back history={this.props.history} />
				<h1>{this.state.error}</h1>
			</div>
		) : !this.state.songs || this.state.songs.length === 0 ? (
			<Loader />
		) : (
			<div>
				<div className="top-heading heading">
					<a href="/playlists" className="button">
						Back to My Playlists
					</a>
					<h1>{this.state.name}</h1>
				</div>
				<div id="content-wrapper">
					<Player
						currentSongIndex={this.state.currentSongIndex}
						songs={this.state.songs}
						setCurrentSongIndex={(i) => this.setCurrentSongIndex(i)}
						setPlaylistState={(state) => this.setPlaylistState(state)}
					/>
				</div>
			</div>
		)
}

export default Playlist
