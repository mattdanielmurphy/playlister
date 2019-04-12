import React, { Component } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import { confirmAlert } from 'react-confirm-alert'

import dropbox from '../components/dropbox'
import Player from '../components/Player'
import SafariAlert from '../components/SafariAlert'
import Loader from '../components/Loader'

class Playlist extends Component {
	state = {
		id: this.props.match.params.id,
		name: '',
		songs: [],
		currentSongIndex: 0
	}
	setCurrentSongIndex = (i) => this.setState({ currentSongIndex: i })
	getSongs() {
		fetch(`http://localhost/api/playlists/${this.state.id}`)
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
	alertAboutSafari() {
		// only alert if user didn't request to not be reminded
		if (!Cookies.get('doNotAlertAboutSafari')) {
			const isSafari =
				navigator.vendor &&
				navigator.vendor.indexOf('Apple') > -1 &&
				navigator.userAgent &&
				navigator.userAgent.indexOf('CriOS') === -1 &&
				navigator.userAgent.indexOf('FxiOS') === -1
			if (isSafari) confirmAlert({ customUI: ({ onClose }) => <SafariAlert onClose={onClose} /> })
		}
	}
	setPlaylistState = (state) => this.setState(state)
	componentDidMount() {
		this.getSongs()
		this.alertAboutSafari()
	}
	render() {
		return (
			<main>
				{this.state.error ? (
					<h1>{this.state.error}</h1>
				) : !this.state.songs || this.state.songs.length === 0 ? (
					<Loader />
				) : (
					<div>
						<h1>{this.state.name}</h1>
						<Player
							currentSongIndex={this.state.currentSongIndex}
							songs={this.state.songs}
							setCurrentSongIndex={(i) => this.setCurrentSongIndex(i)}
							setPlaylistState={(state) => this.setPlaylistState(state)}
						/>
					</div>
				)}
			</main>
		)
	}
}

export default Playlist
