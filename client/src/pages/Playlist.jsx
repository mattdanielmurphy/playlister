import React, { Component } from 'react'
import fetch from 'node-fetch'
import Player from '../components/Player'
import dropbox from '../components/dropbox'

class Playlist extends Component {
	state = {
		id: this.props.match.params.id,
		name: '',
		songs: [],
		currentSongIndex: 0
	}
	setCurrentSongIndex(i) {
		this.setState({ currentSongIndex: i })
	}
	async componentDidMount() {
		const { account_id } = await dropbox.getUser()
		fetch(`http://localhost/api/${account_id}/playlists/${this.state.id}`)
			.then(async (res) => {
				const { songs, name, date } = await res.json()
				this.setState({
					songs: Object.values(songs),
					name,
					date
				})
			})
			.catch(() => {
				this.setState({
					error: 'Error: Playlist not found!'
				})
			})
	}
	render() {
		return (
			<main>
				{this.state.error ? (
					<h1>{this.state.error}</h1>
				) : (
					<div>
						<h1>Playlist: {this.state.name}</h1>
						<Player
							currentSongIndex={this.state.currentSongIndex}
							songs={this.state.songs}
							setCurrentSongIndex={(i) => this.setCurrentSongIndex(i)}
						/>
					</div>
				)}
			</main>
		)
	}
}

export default Playlist
