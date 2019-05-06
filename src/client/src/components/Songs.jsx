import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import dropbox from './dropbox'
import Song from './Song'
import Loader from '../components/Loader'

class Songs extends Component {
	state = {
		songs: []
	}
	isSongInPlaylist(song) {
		let songIsInPlaylist = false

		for (let i = 0; i < this.props.playlistSongs.length; i++) {
			const playlistSong = this.props.playlistSongs[i]
			if (playlistSong.id === song.id) {
				songIsInPlaylist = true
				break
			}
		}

		return songIsInPlaylist
	}
	componentDidMount() {
		dropbox.getSongs().then((songs) => this.setState({ songs }))
	}
	render = () =>
		this.state.songs.length < 1 ? (
			<Loader type="inline" />
		) : (
			<div>
				<div className="heading">
					<h2 className="inline">Songs</h2>
					<Link to="/adding-songs">(Not sure how to add songs?)</Link>
				</div>
				<div id="songs">
					{this.state.songs.map((song, i) => (
						<Song
							key={i}
							removeSongFromPlaylist={() => this.props.removeSongFromPlaylist(song)}
							addSongToPlaylist={() => this.props.addSongToPlaylist(song)}
							name={song.name}
							selected={this.isSongInPlaylist(song)}
						/>
					))}
				</div>
			</div>
		)
}

export default Songs
