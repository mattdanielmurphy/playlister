import React, { Component } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import { confirmAlert } from 'react-confirm-alert'

import dropbox from '../components/dropbox'
import Player from '../components/Player'
import SafariAlert from '../components/SafariAlert'

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
	async getSongsOfUser() {
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
	alertAboutSafari() {
		// only alert if user didn't request to not be reminded
		if (!Cookies.get('doNotAlertAboutSafari')) {
			const isSafari =
				navigator.vendor &&
				navigator.vendor.indexOf('Apple') > -1 &&
				navigator.userAgent &&
				navigator.userAgent.indexOf('CriOS') == -1 &&
				navigator.userAgent.indexOf('FxiOS') == -1
			if (isSafari) confirmAlert({ customUI: ({ onClose }) => <SafariAlert onClose={onClose} /> })
		}
	}
	componentDidMount() {
		this.alertAboutSafari()
		this.getSongsOfUser()
	}
	render() {
		return (
			<main>
				{this.state.error ? (
					<h1>{this.state.error}</h1>
				) : (
					<div>
						<h1>{this.state.name}</h1>
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
